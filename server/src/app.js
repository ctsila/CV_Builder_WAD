const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { init, db } = require('./db')
const { createUser, createProfile } = require('./models')
const generator = require('./generator')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: '1mb' }))

async function main() {
  await init()

  app.get('/api/ping', (req, res) => res.json({ ok: true }))

  app.post('/api/auth/register', async (req, res) => {
    const { email, name } = req.body
    const user = createUser({ email, name })
    db.data.users.push(user)
    await db.write()
    res.json({ user })
  })

  app.post('/api/profile', async (req, res) => {
    const data = req.body
    const profile = createProfile(data)
    db.data.profiles.push(profile)
    await db.write()
    res.json({ profile })
  })

  app.get('/api/profile/:id', (req, res) => {
    const p = db.data.profiles.find(x => x.id === req.params.id)
    if (!p) return res.status(404).json({ error: 'not found' })
    res.json({ profile: p })
  })

  app.post('/api/vacancy/parse', (req, res) => {
    const { text } = req.body
    const analysis = generator.analyzeVacancy(text)
    res.json({ analysis })
  })

  app.post('/api/generate/resume', (req, res) => {
    const { profile, vacancyText } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const out = generator.generateResume(profile, analysis)
    res.json(out)
  })

  app.post('/api/generate/cover-letter', (req, res) => {
    const { profile, vacancyText, tone } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const out = generator.generateCoverLetter(profile, vacancyText, analysis, tone)
    res.json(out)
  })

  app.post('/api/compare', (req, res) => {
    const { profile, vacancyText, tone } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const gen = generator.generateResume(profile, analysis)
    const cover = generator.generateCoverLetter(profile, vacancyText, analysis, tone)
    // Compose a simple compare response including ATS match and risk flags
    res.json({ analysis, resume: gen.resume, coverLetter: cover.letter, atsMatch: gen.atsMatch, riskFlags: gen.riskFlags, strengths: gen.strengths })
  })

  app.get('/api/validate', (req, res) => {
    // Basic health + validation checks
    const ok = true
    const details = { db: !!db, serverTime: new Date().toISOString() }
    res.json({ ok, details })
  })

  app.post('/api/export/text', (req, res) => {
    const { resume } = req.body
    const text = []
    text.push(resume.header.name)
    text.push(JSON.stringify(resume.header.contact || {}))
    text.push('\nSummary:\n' + resume.summary)
    text.push('\nSkills:\n' + (resume.skills || []).join(', '))
    (resume.experiences || []).forEach(exp => {
      text.push(`\n${exp.title} @ ${exp.company} (${exp.start} - ${exp.end || 'Present'})`)
      exp.bullets.forEach(b => text.push(' - ' + b))
    })
    res.setHeader('Content-Type', 'text/plain')
    res.send(text.join('\n'))
  })

  // Serve client SPA at root and keep /client as alias
  const clientDir = path.join(__dirname, '..', 'client')
  app.use(express.static(clientDir))
  app.use('/client', express.static(clientDir))

  // Basic API root for quick health and instructions
  app.get('/', (req, res) => {
    res.sendFile(path.join(clientDir, 'index.html'))
  })

  // Fallback: API 404s return JSON, non-API routes return SPA index (SPA routing)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'not found' })
    res.sendFile(path.join(clientDir, 'index.html'))
  })

  const port = process.env.PORT || 4000
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
}

main().catch(err => { console.error(err); process.exit(1) })
