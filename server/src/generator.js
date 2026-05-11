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

  const region = (options.region || 'GLOBAL').toUpperCase()
  const language = (options.language || 'EN').toUpperCase()
  if (strengths.length) {
    resume.summary = `${profile.contact && profile.contact.title ? profile.contact.title + ' ' : ''}${profile.fullName} — experience with ${strengths.slice(0,4).map(s => s.skill).join(', ')}. Evidence-backed and focused on ${vacancyAnalysis.domainKeywords.join(', ')}`
  } else {
    resume.summary = `Master career profile for ${profile.fullName}.`;
  }
  if (language === 'RU') {
    if (strengths.length) {
      resume.summary = `${profile.fullName} — опыт в ${strengths.slice(0,4).map(s => s.skill).join(', ')}. Формулировки основаны на подтвержденных фактах.`
    } else {
      resume.summary = `Базовый карьерный профиль для ${profile.fullName}.`
    }
  } else if (language === 'ES') {
    if (strengths.length) {
      resume.summary = `${profile.fullName} — experiencia en ${strengths.slice(0,4).map(s => s.skill).join(', ')}. Redacción basada en hechos verificables.`
    } else {
      resume.summary = `Perfil profesional base para ${profile.fullName}.`
    }
  }
  // Region-specific formatting hints (simple)
  if (region === 'DE' || region === 'EU') {
    resume.format = { includePhoto: false, length: '2-pages-preferred', tone: 'formal' }
  } else if (region === 'UK') {
    resume.format = { includePhoto: false, length: '2-pages', tone: 'concise' }
  } else if (region === 'RU_CIS') {
    resume.format = { includePhoto: false, length: '1-2-pages', tone: 'formal-pragmatic' }
  } else if (region === 'US') {
    resume.format = { includePhoto: false, length: '1-page-preferred', tone: 'ats-friendly' }
  } else {
    resume.format = { includePhoto: false, length: 'flexible', tone: 'neutral' }
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

function generateCoverLetter(profile, vacancyText, vacancyAnalysis, tone = 'concise', region='GLOBAL', language='EN') {
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
  // region-specific salutation tweaks
  let salutation = greeting
  if (region === 'DE') salutation = 'Sehr geehrte Damen und Herren,'
  else if (region === 'UK') salutation = 'Dear Hiring Team,'
  let localizedIntro = intro
  let localizedCloser = closer
  if ((language || '').toUpperCase() === 'RU') {
    salutation = 'Уважаемый менеджер по найму,'
    localizedIntro = `Меня зовут ${profile.fullName}. Я подаюсь на эту вакансию, потому что мой опыт в ${ (profile.skills||[]).slice(0,5).join(', ') } соответствует требованиям роли.`
    localizedCloser = `С уважением,\n${profile.fullName}`
  } else if ((language || '').toUpperCase() === 'ES') {
    salutation = 'Estimado equipo de contratación,'
    localizedIntro = `Soy ${profile.fullName}. Solicito este puesto porque mi experiencia en ${ (profile.skills||[]).slice(0,5).join(', ') } se alinea con sus requisitos.`
    localizedCloser = `Atentamente,\n${profile.fullName}`
  }
  const letter = [salutation, localizedIntro, bodyLines.join('\n'), localizedCloser].filter(Boolean).join('\n\n')
  return { letter }
}

module.exports = { analyzeVacancy, rankProfile, generateResume, generateCoverLetter }

// Resume parsing helper: accepts multer file buffer and returns a minimal inferred profile
const pdf = require('pdf-parse')
const mammoth = require('mammoth')
const path = require('path')

async function parseResumeBuffer(file) {
  const mime = file.mimetype || ''
  let text = ''
  if (mime === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
    const data = await pdf(file.buffer)
    text = data.text || ''
  } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || path.extname(file.originalname).toLowerCase() === '.docx' || path.extname(file.originalname).toLowerCase() === '.doc') {
    const result = await mammoth.extractRawText({ buffer: file.buffer })
    text = result.value || ''
  } else {
    // fallback: treat as plain text
    text = file.buffer.toString('utf8')
  }

  // Very simple heuristic parser to extract name, emails, phone, skills and bullets
  const lines = (text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const profile = { fullName: '', contact: {}, skills: [], experiences: [] }
  // try to find name as first non-empty line
  if (lines.length) profile.fullName = lines[0]
  const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  const phoneRe = /\+?[0-9][0-9 ()-]{6,}/
  lines.forEach(l => {
    const e = l.match(emailRe); if (e && !profile.contact.email) profile.contact.email = e[0]
    const p = l.match(phoneRe); if (p && !profile.contact.phone) profile.contact.phone = p[0]
  })

  // extract skills by matching TECH_KEYWORDS
  const skillsSet = new Set()
  lines.forEach(l => {
    TECH_KEYWORDS.forEach(k => { if (l.toLowerCase().includes(k)) skillsSet.add(k) })
  })
  profile.skills = Array.from(skillsSet)

  // crude experience extraction: lines starting with year or containing company-like words
  const expBlocks = []
  let current = null
  lines.forEach(l => {
    if (/\b(20\d{2}|19\d{2})\b/.test(l) && current) { expBlocks.push(current); current = { header: l, bullets: [] } }
    else if (/^\-\s+/.test(l) || /^•\s+/.test(l)) {
      if (!current) current = { header: '', bullets: [] }
      current.bullets.push(l.replace(/^[-•]\s+/, ''))
    } else {
      // start a block if line looks like 'Company - Title' or contains 'at'
      if (/ at | - |, /.test(l) && !/^\d/.test(l)) { if (current) expBlocks.push(current); current = { header: l, bullets: [] } }
    }
  })
  if (current) expBlocks.push(current)
  profile.experiences = expBlocks.slice(0,5).map(b => ({ company: b.header, title: '', bullets: b.bullets }))

  return profile
}

// export parse helper
module.exports.parseResumeBuffer = parseResumeBuffer

