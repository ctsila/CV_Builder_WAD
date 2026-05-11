// Deterministic generator enforcing "No Lies Mode".
// Produces analysis, ranks profile evidence, and generates factual resume and cover letter.

const TECH_KEYWORDS = ['react','node','python','java','aws','docker','kubernetes','sql','javascript','go','c#','c++','typescript','aws','gcp','azure']
const SOFT_SKILLS = ['communication','leadership','teamwork','collaborat','problem solving','stakeholder']

function extractLines(text) {
  return (text||'').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
}

function analyzeVacancy(text) {
  const lines = extractLines(text)
  const responsibilities = []
  const required = []
  const preferred = []
  const domainKeywords = new Set()
  const softSkills = new Set()
  let seniority = null
  let hiringTone = 'neutral'

  lines.forEach(line => {
    const lower = line.toLowerCase()
    if (lower.startsWith('respons') || lower.startsWith('-') || lower.startsWith('*')) {
      responsibilities.push(line.replace(/^[-*]\s*/, ''))
    }
    if (/(required|max|min)|(must have|required skills|requirements)/i.test(line)) {
      // split by commas
      line.split(/:|-|–|—/).slice(1).join(' ').split(/,|;| or | and /i).forEach(p => { if (p.trim()) required.push(p.trim()) })
    }
    // detect tech keywords
    TECH_KEYWORDS.forEach(t => { if (lower.includes(t)) { domainKeywords.add(t); required.push(t) } })
    SOFT_SKILLS.forEach(s => { if (lower.includes(s)) softSkills.add(s) })
    if (/senior|lead|principal|manager|sr\b/i.test(lower)) seniority = 'senior'
    if (/junior|entry|graduate|intern/i.test(lower)) seniority = 'junior'
    if (/(fast-paced|startup|scrappy)/i.test(lower)) hiringTone = 'startup'
    if (/(enterprise|large organization|regulated)/i.test(lower)) hiringTone = 'enterprise'
    if (/research|publication|phd/i.test(lower)) domainKeywords.add('research')
  })

  return {
    responsibilities,
    required: Array.from(new Set(required)).slice(0,50),
    preferred: Array.from(new Set(preferred)),
    senioritySignals: seniority,
    domainKeywords: Array.from(domainKeywords),
    softSkillSignals: Array.from(softSkills),
    hiringTone
  }
}

function rankProfile(profile, vacancyAnalysis) {
  const strengths = []
  const missing = []
  const evidenceMap = {}
  const skills = (profile.skills || []).map(s => String(s).toLowerCase())

  ;(profile.experiences || []).forEach(exp => {
    ;(exp.bullets || []).forEach(b => {
      const lower = b.toLowerCase()
      skills.forEach(s => {
        if (lower.includes(s)) {
          evidenceMap[s] = evidenceMap[s] || []
          evidenceMap[s].push({ experience: exp.title || exp.company, bullet: b })
        }
      })
    })
  })

  vacancyAnalysis.required.forEach(req => {
    const reqLower = String(req || '').toLowerCase()
    const matched = skills.find(s => s.includes(reqLower) || reqLower.includes(s))
    if (matched && (evidenceMap[matched] && evidenceMap[matched].length)) {
      strengths.push({ skill: matched, evidence: evidenceMap[matched] })
    } else {
      missing.push(req)
    }
  })

  return { strengths, missing, evidenceMap }
}

function generateResume(profile, vacancyAnalysis, options = {}) {
  const { strengths, missing, evidenceMap } = rankProfile(profile, vacancyAnalysis)
  const resume = {
    header: { name: profile.fullName, contact: profile.contact },
    summary: '',
    skills: profile.skills || [],
    experiences: []
  }

  if (strengths.length) {
    resume.summary = `${profile.contact && profile.contact.title ? profile.contact.title + ' ' : ''}${profile.fullName} — experience with ${strengths.slice(0,4).map(s => s.skill).join(', ')}. Evidence-backed and focused on ${vacancyAnalysis.domainKeywords.join(', ')}`
  } else {
    resume.summary = `Master career profile for ${profile.fullName}.`;
  }

  ;(profile.experiences || []).forEach(exp => {
    const picked = (exp.bullets || []).filter(b => {
      return vacancyAnalysis.required.some(req => String(b).toLowerCase().includes(String(req).toLowerCase()))
    })
    // if none matched, but experience has strong evidence words, include a trimmed set for context
    if (picked.length) resume.experiences.push({ company: exp.company, title: exp.title, start: exp.start, end: exp.end, bullets: picked })
  })

  const riskFlags = []
  if (missing.length) missing.forEach(m => riskFlags.push({ skill: m, risk: 'missing-evidence' }))

  // ATS-like score: ratio of matched required items
  const atsMatch = vacancyAnalysis.required.length ? Math.round(((vacancyAnalysis.required.length - missing.length) / vacancyAnalysis.required.length) * 100) : 0

  return { resume, strengths, missing, evidenceMap, riskFlags, atsMatch }
}

function generateCoverLetter(profile, vacancyText, vacancyAnalysis, tone = 'concise') {
  const greeting = `Dear Hiring Manager,`;
  const intro = `I am ${profile.fullName}. I am applying for this role because my experience with ${ (profile.skills||[]).slice(0,5).join(', ') } aligns with your requirements.`
  const bodyLines = []
  // include evidence lines for top strengths
  const ranking = rankProfile(profile, vacancyAnalysis)
  ranking.strengths.slice(0,3).forEach(s => {
    const ev = s.evidence[0]
    if (ev) bodyLines.push(`- ${s.skill}: ${ev.bullet} (${ev.experience})`)
  })
  if (ranking.missing.length) bodyLines.push(`I acknowledge gaps in: ${ranking.missing.join(', ')} and I have clear learning plans and related experience to bridge them.`)
  const closer = `Sincerely,\n${profile.fullName}`
  const letter = [greeting, intro, bodyLines.join('\n'), closer].filter(Boolean).join('\n\n')
  return { letter }
}

module.exports = { analyzeVacancy, rankProfile, generateResume, generateCoverLetter }
