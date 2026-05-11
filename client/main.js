const apiBase = 'http://localhost:4000'

document.getElementById('analyze').addEventListener('click', async () => {
  const text = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/vacancy/parse', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ text }) })
  const j = await res.json()
  alert('Vacancy analysis: ' + JSON.stringify(j.analysis))
})

document.getElementById('saveProfile').addEventListener('click', async () => {
  let data
  try { data = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
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
