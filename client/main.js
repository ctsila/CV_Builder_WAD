const apiBase = 'http://localhost:4000'

document.getElementById('analyze').addEventListener('click', async () => {
  const text = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/vacancy/parse', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) })
  const j = await res.json()
  alert('Vacancy analysis: ' + JSON.stringify(j.analysis))
})

document.getElementById('saveProfile').addEventListener('click', async () => {
  const value = document.getElementById('profile').value
  let data = { fullName: '', contact: {}, skills: [], experiences: [] }
  try { data = JSON.parse(value) } catch(e) { data = { fullName: value.split('\n')[0] || '', contact: {}, skills: [], experiences: [] } }
  const res = await fetch(apiBase + '/api/profile', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
  const j = await res.json()
  alert('Profile saved: ' + j.profile.id)
})

document.getElementById('generate').addEventListener('click', async () => {
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile, vacancyText }) })
  const j = await res.json()
  document.getElementById('result').textContent = JSON.stringify(j, null, 2)
})

document.getElementById('uploadResume').addEventListener('click', async () => {
  const fileEl = document.getElementById('resumeFile')
  if (!fileEl.files.length) return alert('Choose a file')
  const f = fileEl.files[0]
  const fd = new FormData()
  fd.append('file', f)
  const res = await fetch(apiBase + '/api/upload/resume', { method: 'POST', body: fd })
  const j = await res.json()
  if (j.parsed) {
    document.getElementById('profile').value = JSON.stringify(j.parsed, null, 2)
    alert('Parsed resume — review and save the profile')
  } else {
    alert('Failed to parse resume')
  }
})

document.getElementById('importSample').addEventListener('click', async () => {
  const res = await fetch('sample_profile.json')
  const j = await res.json()
  document.getElementById('profile').value = JSON.stringify(j, null, 2)
})

document.getElementById('importVacancy').addEventListener('click', async () => {
  const res = await fetch('sample_vacancy.txt')
  const t = await res.text()
  document.getElementById('vacancy').value = t
})

document.getElementById('compare').addEventListener('click', async () => {
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/compare', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile, vacancyText, tone: 'concise' }) })
  const j = await res.json()
  document.getElementById('analysis').textContent = JSON.stringify(j.analysis, null, 2)
  document.getElementById('result').textContent = JSON.stringify(j.resume, null, 2)
  document.getElementById('cover').textContent = j.coverLetter
  if (j.atsMatch !== undefined) {
    document.getElementById('analysis').textContent += `\n\nATS Match: ${j.atsMatch}%\nRisk Flags: ${JSON.stringify(j.riskFlags || [])}`
  }
})

document.getElementById('exportText').addEventListener('click', async () => {
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile, vacancyText }) })
  const j = await res.json()
  const r = await fetch(apiBase + '/api/export/text', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resume: j.resume }) })
  const text = await r.text()
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (profile.fullName || 'resume') + '.txt'
  a.click()
})

// Export PDF
document.getElementById('exportPdf')?.addEventListener('click', async () => {
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile, vacancyText, region: document.getElementById('region').value }) })
  const j = await res.json()
  const r = await fetch(apiBase + '/api/export/pdf', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resume: j.resume }) })
  const blob = await r.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (profile.fullName || 'resume') + '.pdf'
  a.click()
})

// Interview prep
document.getElementById('interviewBtn')?.addEventListener('click', async () => {
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/interview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile, vacancyText }) })
  const j = await res.json()
  alert('Interview questions:\n' + JSON.stringify(j, null, 2))
})
