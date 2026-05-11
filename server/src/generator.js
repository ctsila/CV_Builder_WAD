// Deterministic generator enforcing "No Lies Mode".
// It produces tailored resume bullets only from evidence provided in the profile.

function analyzeVacancy(text) {
  const lowered = (text || '').toLowerCase()
  const required = []
  const preferred = []
  // naive keyword extraction: match words after 'required' or 'must have'
  if (lowered.includes('required') || lowered.includes('must have')) {
    // crude split
    const tokens = lowered.split(/[,\n\.]/).map(s => s.trim())
    tokens.forEach(t => {
      if (t.includes('required') || t.includes('must have')) {
        const parts = t.split('required').pop().split('must have').pop().trim()
        parts.split(/and|,|or/).forEach(p => { if (p) required.push(p.trim()) })
      }
    })
  }
  // fallback: pull technology words
  const tech = ['react','node','python','java','aws','docker','kubernetes','sql','javascript']
  tech.forEach(t => { if (lowered.includes(t)) required.push(t) })
  return { required: Array.from(new Set(required)).slice(0,20), preferred }
}

function rankProfile(profile, vacancyAnalysis) {
  const strengths = []
  const missing = []
  const evidenceMap = {}
  const skills = profile.skills || []
  (profile.experiences || []).forEach(exp => {
    (exp.bullets || []).forEach(b => {
      const lower = b.toLowerCase()
      skills.forEach(s => { if (lower.includes(String(s).toLowerCase())) evidenceMap[s] = evidenceMap[s] || []; evidenceMap[s].push({ experience: exp.title, bullet: b }) })
    })
  })
  vacancyAnalysis.required.forEach(req => {
    const matched = skills.find(s => String(s).toLowerCase().includes(req) )
    if (matched && evidenceMap[matched]) strengths.push({ skill: matched, evidence: evidenceMap[matched] })
    else missing.push(req)
  })
  return { strengths, missing, evidenceMap }
}

function generateResume(profile, vacancyAnalysis, options = {}) {
  // Compose a resume using only profile facts and evidence
  const { strengths, missing, evidenceMap } = rankProfile(profile, vacancyAnalysis)
  const resume = {
    header: { name: profile.fullName, contact: profile.contact },
    summary: '',
    skills: profile.skills || [],
    experiences: []
  }
  // Summary: factual, mention top strengths
  if (strengths.length) {
    resume.summary = `Experienced ${profile.contact && profile.contact.title ? profile.contact.title + ' ' : ''} with proven work on ${strengths.slice(0,3).map(s=>s.skill).join(', ')}.`
  } else {
    resume.summary = `Master career profile for ${profile.fullName}.`;
  }
  // Experiences: include only bullets that mention target skills
  (profile.experiences || []).forEach(exp => {
    const picked = (exp.bullets || []).filter(b => {
      return vacancyAnalysis.required.some(req => b.toLowerCase().includes(req))
    })
    if (picked.length) resume.experiences.push({ company: exp.company, title: exp.title, start: exp.start, end: exp.end, bullets: picked })
  })
  // If missing required skills, add honest statements about willingness to learn or related experience
  const riskFlags = []
  if (missing.length) {
    missing.forEach(m => {
      riskFlags.push({ skill: m, risk: 'missing-evidence' })
    })
  }
  return { resume, strengths, missing, evidenceMap, riskFlags }
}

function generateCoverLetter(profile, vacancyText, vacancyAnalysis, tone = 'concise') {
  const greeting = `Dear Hiring Manager,`;
  const intro = `I am ${profile.fullName} and I am applying for this role. I have experience with ${ (profile.skills||[]).slice(0,5).join(', ') }.`
  const body = `I am sharing evidence-backed achievements and have included details in the attached resume. I prefer honest framing: where I lack direct experience, I explain related experience and learning plans.`
  const closer = `Sincerely,\n${profile.fullName}`
  return { letter: [greeting, intro, body, closer].join('\n\n') }
}

module.exports = { analyzeVacancy, rankProfile, generateResume, generateCoverLetter }
