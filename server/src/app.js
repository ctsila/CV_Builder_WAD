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
    const { email, name, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })
    const bcrypt = require('bcryptjs')
    const { createAuthUser } = require('./models')
    const existing = db.data.users.find(u => u.email === email)
    if (existing) return res.status(400).json({ error: 'user_exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = createAuthUser({ email, name, passwordHash: hash })
    db.data.users.push(user)
    await db.write()
    res.json({ user: { id: user.id, email: user.email, name: user.name } })
  })

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' })
    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const user = db.data.users.find(u => u.email === email)
    if (!user) return res.status(400).json({ error: 'invalid_credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ error: 'invalid_credentials' })
    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
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

  // Resume / CV upload and parsing (PDF and DOCX)
  const multer = require('multer')
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

  app.post('/api/upload/resume', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'no file' })
      const parsed = await generator.parseResumeBuffer(req.file)
      res.json({ parsed })
    } catch (err) {
      console.error('upload parse error', err)
      res.status(500).json({ error: 'parse_failed', message: String(err) })
    }
  })

  app.post('/api/generate/resume', (req, res) => {
    const { profile, vacancyText, region } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const out = generator.generateResume(profile, analysis, { region })
    res.json(out)
  })

  app.post('/api/generate/cover-letter', (req, res) => {
    const { profile, vacancyText, tone, region } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const out = generator.generateCoverLetter(profile, vacancyText, analysis, tone, region)
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

  // Export resume as PDF
  app.post('/api/export/pdf', async (req, res) => {
    try {
      const PDFDocument = require('pdfkit')
      const { resume } = req.body
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const buffers = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf')
        res.send(pdfData)
      })
      // Simple PDF rendering: header, summary, skills, experiences
      doc.fontSize(18).text(resume.header.name || '', { align: 'left' })
      if (resume.header.contact) doc.fontSize(10).text(JSON.stringify(resume.header.contact))
      doc.moveDown()
      doc.fontSize(12).text('Summary')
      doc.fontSize(10).text(resume.summary || '')
      doc.moveDown()
      doc.fontSize(12).text('Skills')
      doc.fontSize(10).text((resume.skills || []).join(', '))
      doc.moveDown()
      doc.fontSize(12).text('Experience')
      ;(resume.experiences || []).forEach(exp => {
        doc.fontSize(11).text(`${exp.title || ''} @ ${exp.company || ''} (${exp.start || ''} - ${exp.end || 'Present'})`)
        (exp.bullets || []).forEach(b => doc.fontSize(10).text(' • ' + b))
        doc.moveDown()
      })
      doc.end()
    } catch (err) {
      console.error('PDF export error', err)
      res.status(500).json({ error: 'pdf_failed' })
    }
  })

  app.get('/api/validate', (req, res) => {
    // Basic health + validation checks
    const ok = true
    const details = { db: !!db, serverTime: new Date().toISOString() }
    res.json({ ok, details })
  })

  // Interview prep generator (simple heuristics)
  app.post('/api/interview', (req, res) => {
    const { profile, vacancyText } = req.body
    const analysis = generator.analyzeVacancy(vacancyText)
    const questions = []
    // technical questions from domainKeywords
    (analysis.domainKeywords || []).slice(0,5).forEach(k => questions.push(`Technical: Describe your experience with ${k} and a challenge you solved.`))
    ;(analysis.responsibilities || []).slice(0,5).forEach(r => questions.push(`Behavioral: Tell me about a time you ${r}`))
    questions.push('CV-defense: Which bullet on your resume would you most likely be asked to expand on? Prepare a STAR example.')
    res.json({ questions })
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
  // __dirname is /server/src so go up two levels to workspace root client/
  const clientDir = path.join(__dirname, '..', '..', 'client')
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
