const apiBase = 'http://localhost:4000'

let authToken = localStorage.getItem('authToken') || ''
let theme = localStorage.getItem('theme') || 'light'
let currentView = 'builder'

const i18n = {
  EN: {
    pageTitle: 'AI Resume Generator',
    authTitle: 'Authentication',
    localeTitle: 'Localization',
    profileTitle: 'Master Profile',
    uploadLabel: 'Upload resume (PDF or DOCX):',
    pasteLabel: 'Or paste your resume text:',
    regionLabel: 'Target country/region',
    vacancyTitle: 'Vacancy Text',
    compareTitle: 'Compare and Generated Outputs',
    analysisTitle: 'Job Analysis',
    resumeTitle: 'Generated Resume',
    coverTitle: 'Generated Cover Letter',
    appLanguageLabel: 'Web page language',
    resumeLanguageLabel: 'Resume language',
    namePlaceholder: 'Name',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    profilePlaceholder: 'Paste resume text or JSON profile',
    vacancyPlaceholder: 'Paste job posting text or URL',
    registerBtn: 'Register',
    loginBtn: 'Login',
    logoutBtn: 'Logout',
    uploadResume: 'Upload and Parse',
    saveProfile: 'Save Profile',
    importSample: 'Load Sample Profile',
    importVacancy: 'Load Sample Vacancy',
    analyze: 'Analyze Vacancy',
    generate: 'Generate Resume',
    compare: 'Compare (analysis + outputs)',
    exportText: 'Export Text',
    exportPdf: 'Export PDF',
    interviewBtn: 'Generate Interview Prep',
    quickStartTitle: 'Quick Start',
    quickStartText: 'Load sample data, run analysis, and preview how your profile adapts to different markets.',
    historyTitle: 'History',
    historyEmpty: 'No history yet. Upload, generate, or analyze something and it will appear here.',
    builderTab: 'Builder',
    historyTab: 'History',
    recentActivity: 'Recent activity',
    loginRequiredTitle: 'Login required',
    loginRequiredText: 'Register or log in above to unlock uploads, generation, exports, and history.',
    darkLabel: 'Dark',
    lightLabel: 'Light',
    notLoggedIn: 'Not logged in',
    loggedInAs: 'Logged in as',
    needLogin: 'Please login first',
    chooseFile: 'Choose a file',
    parsedOk: 'Parsed resume - review and save the profile',
    parseFail: 'Failed to parse resume'
  },
  RU: {
    pageTitle: 'AI генератор резюме',
    authTitle: 'Авторизация',
    localeTitle: 'Локализация',
    profileTitle: 'Профиль карьеры',
    uploadLabel: 'Загрузите резюме (PDF или DOCX):',
    pasteLabel: 'Или вставьте текст резюме:',
    regionLabel: 'Целевая страна/регион',
    vacancyTitle: 'Текст вакансии',
    compareTitle: 'Сравнение и результаты генерации',
    analysisTitle: 'Анализ вакансии',
    resumeTitle: 'Сгенерированное резюме',
    coverTitle: 'Сгенерированное сопроводительное письмо',
    appLanguageLabel: 'Язык интерфейса',
    resumeLanguageLabel: 'Язык резюме',
    namePlaceholder: 'Имя',
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Пароль',
    profilePlaceholder: 'Вставьте текст резюме или JSON профиль',
    vacancyPlaceholder: 'Вставьте текст вакансии или ссылку',
    registerBtn: 'Регистрация',
    loginBtn: 'Войти',
    logoutBtn: 'Выйти',
    uploadResume: 'Загрузить и разобрать',
    saveProfile: 'Сохранить профиль',
    importSample: 'Загрузить пример профиля',
    importVacancy: 'Загрузить пример вакансии',
    analyze: 'Анализировать вакансию',
    generate: 'Сгенерировать резюме',
    compare: 'Сравнить (анализ + результат)',
    exportText: 'Экспорт в текст',
    exportPdf: 'Экспорт в PDF',
    interviewBtn: 'Сгенерировать подготовку к интервью',
    quickStartTitle: 'Быстрый старт',
    quickStartText: 'Загрузите пример данных, запустите анализ и посмотрите, как профиль адаптируется под рынки.',
    historyTitle: 'История',
    historyEmpty: 'Пока нет истории. Загрузите, сгенерируйте или проанализируйте что-нибудь, и оно появится здесь.',
    builderTab: 'Конструктор',
    historyTab: 'История',
    recentActivity: 'Последняя активность',
    loginRequiredTitle: 'Требуется вход',
    loginRequiredText: 'Зарегистрируйтесь или войдите выше, чтобы разблокировать загрузку, генерацию, экспорт и историю.',
    darkLabel: 'Темная',
    lightLabel: 'Светлая',
    notLoggedIn: 'Не выполнен вход',
    loggedInAs: 'Вход выполнен:',
    needLogin: 'Сначала выполните вход',
    chooseFile: 'Выберите файл',
    parsedOk: 'Резюме распознано - проверьте и сохраните профиль',
    parseFail: 'Не удалось распознать резюме'
  }
}

function t(key) {
  const lang = document.getElementById('appLanguage')?.value || 'EN'
  return (i18n[lang] && i18n[lang][key]) || i18n.EN[key] || key
}

function authHeaders(extra = {}) {
  const h = { ...extra }
  if (authToken) h.Authorization = `Bearer ${authToken}`
  return h
}

function setView(view) {
  currentView = view
  const builderView = document.getElementById('builderView')
  const historyView = document.getElementById('historyView')
  const builderTab = document.getElementById('builderTab')
  const historyTab = document.getElementById('historyTab')
  if (builderView) builderView.classList.toggle('hidden', view !== 'builder')
  if (historyView) historyView.classList.toggle('hidden', view !== 'history')
  if (builderTab) builderTab.classList.toggle('active', view === 'builder')
  if (historyTab) historyTab.classList.toggle('active', view === 'history')
  if (view === 'history') loadHistory()
}

function setWorkflowEnabled(enabled) {
  const ids = ['resumeFile', 'uploadResume', 'profile', 'saveProfile', 'region', 'resumeLanguage', 'vacancy', 'analyze', 'generate', 'compare', 'exportText', 'exportPdf', 'interviewBtn', 'importSample', 'importVacancy']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (!el) return
    if ('disabled' in el) el.disabled = !enabled
  })
  const loginPrompt = document.getElementById('loginPrompt')
  if (loginPrompt) loginPrompt.classList.toggle('hidden', enabled)
}

async function loadHistory() {
  const list = document.getElementById('historyList')
  if (!list) return
  if (!authToken) {
    list.innerHTML = `<div class="history-empty">${t('needLogin')}</div>`
    return
  }
  list.innerHTML = '<div class="history-empty">Loading...</div>'
  const res = await fetch(apiBase + '/api/history', { headers: authHeaders() })
  const j = await res.json()
  if (!res.ok) {
    list.innerHTML = `<div class="history-empty">${j.error || 'Failed to load history'}</div>`
    return
  }
  const items = j.history || []
  if (!items.length) {
    list.innerHTML = `<div class="history-empty">${t('historyEmpty')}</div>`
    return
  }
  list.innerHTML = items.map(item => {
    const meta = item.details ? JSON.stringify(item.details, null, 2) : ''
    return `
      <article class="history-item">
        <div class="history-item-head">
          <div>
            <p class="history-type">${item.type}</p>
            <h3>${item.title}</h3>
          </div>
          <time>${new Date(item.createdAt).toLocaleString()}</time>
        </div>
        ${meta ? `<pre>${meta}</pre>` : ''}
      </article>
    `
  }).join('')
}

function ensureAuth() {
  if (!authToken) {
    alert(t('needLogin'))
    return false
  }
  return true
}

function updateAuthStatus(userEmail = '') {
  const el = document.getElementById('authStatus')
  if (!el) return
  if (authToken) el.textContent = `${t('loggedInAs')} ${userEmail || localStorage.getItem('userEmail') || ''}`
  else el.textContent = t('notLoggedIn')
  setWorkflowEnabled(!!authToken)
}

function applyAppLanguage() {
  const map = [
    ['authTitle', 'authTitle'],
    ['localeTitle', 'localeTitle'],
    ['profileTitle', 'profileTitle'],
    ['uploadLabel', 'uploadLabel'],
    ['pasteLabel', 'pasteLabel'],
    ['regionLabel', 'regionLabel'],
    ['vacancyTitle', 'vacancyTitle'],
    ['compareTitle', 'compareTitle'],
    ['analysisTitle', 'analysisTitle'],
    ['resumeTitle', 'resumeTitle'],
    ['coverTitle', 'coverTitle'],
    ['appLanguageLabel', 'appLanguageLabel'],
    ['resumeLanguageLabel', 'resumeLanguageLabel']
  ]
  map.forEach(([id, key]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = t(key)
  })

  // Headline and supporting text
  const h1 = document.querySelector('h1')
  if (h1) h1.textContent = t('pageTitle')
  const quickTitle = document.querySelector('.content-grid.two h3')
  if (quickTitle) quickTitle.textContent = t('quickStartTitle')
  const quickText = document.querySelector('.content-grid.two .muted')
  if (quickText) quickText.textContent = t('quickStartText')

  // Placeholders
  const authName = document.getElementById('authName')
  const authEmail = document.getElementById('authEmail')
  const authPassword = document.getElementById('authPassword')
  const profile = document.getElementById('profile')
  const vacancy = document.getElementById('vacancy')
  if (authName) authName.placeholder = t('namePlaceholder')
  if (authEmail) authEmail.placeholder = t('emailPlaceholder')
  if (authPassword) authPassword.placeholder = t('passwordPlaceholder')
  if (profile) profile.placeholder = t('profilePlaceholder')
  if (vacancy) vacancy.placeholder = t('vacancyPlaceholder')

  // Button text
  const buttonMap = [
    ['registerBtn', 'registerBtn'],
    ['loginBtn', 'loginBtn'],
    ['logoutBtn', 'logoutBtn'],
    ['uploadResume', 'uploadResume'],
    ['saveProfile', 'saveProfile'],
    ['importSample', 'importSample'],
    ['importVacancy', 'importVacancy'],
    ['analyze', 'analyze'],
    ['generate', 'generate'],
    ['compare', 'compare'],
    ['exportText', 'exportText'],
    ['exportPdf', 'exportPdf'],
    ['interviewBtn', 'interviewBtn']
  ]
  buttonMap.forEach(([id, key]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = t(key)
  })

  const themeToggle = document.getElementById('themeToggle')
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? t('lightLabel') : t('darkLabel')
  }

  const builderTab = document.getElementById('builderTab')
  const historyTab = document.getElementById('historyTab')
  if (builderTab) builderTab.textContent = t('builderTab')
  if (historyTab) historyTab.textContent = t('historyTab')
  const historyHeading = document.querySelector('#historyView h2')
  if (historyHeading) historyHeading.textContent = t('historyTitle')
  const historySubtitle = document.querySelector('#historyView .muted')
  if (historySubtitle) historySubtitle.textContent = t('recentActivity')
  const historyEmpty = document.querySelector('.history-empty')
  if (historyEmpty && !authToken) historyEmpty.textContent = t('needLogin')
  const currentHistoryList = document.getElementById('historyList')
  if (currentHistoryList && currentView === 'history' && authToken) loadHistory()
  const loginPrompt = document.getElementById('loginPrompt')
  if (loginPrompt) {
    const promptTitle = loginPrompt.querySelector('h2')
    const promptText = loginPrompt.querySelector('.muted')
    if (promptTitle) promptTitle.textContent = t('loginRequiredTitle')
    if (promptText) promptText.textContent = t('loginRequiredText')
  }
}

function applyTheme() {
  document.body.setAttribute('data-theme', theme)
  const themeToggle = document.getElementById('themeToggle')
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? t('lightLabel') : t('darkLabel')
  }
}

document.getElementById('registerBtn')?.addEventListener('click', async () => {
  const name = document.getElementById('authName').value.trim()
  const email = document.getElementById('authEmail').value.trim()
  const password = document.getElementById('authPassword').value
  const res = await fetch(apiBase + '/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Register failed')
  alert('Registered. Now log in to unlock uploads and generation.')
})

document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('authEmail').value.trim()
  const password = document.getElementById('authPassword').value
  const res = await fetch(apiBase + '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Login failed')
  authToken = j.token
  localStorage.setItem('authToken', authToken)
  localStorage.setItem('userEmail', j.user.email)
  updateAuthStatus(j.user.email)
  setView(currentView)
  if (currentView === 'history') loadHistory()
})

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  authToken = ''
  localStorage.removeItem('authToken')
  localStorage.removeItem('userEmail')
  updateAuthStatus('')
  document.getElementById('historyList') && (document.getElementById('historyList').innerHTML = `<div class="history-empty">${t('needLogin')}</div>`)
})

document.getElementById('themeToggle')?.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme)
  applyTheme()
})

document.getElementById('builderTab')?.addEventListener('click', () => setView('builder'))
document.getElementById('historyTab')?.addEventListener('click', () => setView('history'))

document.getElementById('analyze').addEventListener('click', async () => {
  if (!ensureAuth()) return
  const text = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/vacancy/parse', { method: 'POST', headers: authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ text }) })
  const j = await res.json()
  alert('Vacancy analysis: ' + JSON.stringify(j.analysis))
})

document.getElementById('saveProfile').addEventListener('click', async () => {
  if (!ensureAuth()) return
  const value = document.getElementById('profile').value
  let data = { fullName: '', contact: {}, skills: [], experiences: [] }
  try { data = JSON.parse(value) } catch(e) { data = { fullName: value.split('\n')[0] || '', contact: {}, skills: [], experiences: [] } }
  const res = await fetch(apiBase + '/api/profile', { method: 'POST', headers: authHeaders({'Content-Type':'application/json'}), body: JSON.stringify(data) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to save profile')
  alert('Profile saved: ' + j.profile.id)
})

document.getElementById('generate').addEventListener('click', async () => {
  if (!ensureAuth()) return
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const region = document.getElementById('region').value
  const language = document.getElementById('resumeLanguage').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ profile, vacancyText, region, language }) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to generate resume')
  document.getElementById('result').textContent = JSON.stringify(j, null, 2)
})

document.getElementById('uploadResume').addEventListener('click', async () => {
  if (!ensureAuth()) return
  const fileEl = document.getElementById('resumeFile')
  if (!fileEl.files.length) return alert(t('chooseFile'))
  const f = fileEl.files[0]
  const fd = new FormData()
  fd.append('file', f)
  const res = await fetch(apiBase + '/api/upload/resume', { method: 'POST', headers: authHeaders(), body: fd })
  const j = await res.json()
  if (j.parsed) {
    document.getElementById('profile').value = JSON.stringify(j.parsed, null, 2)
    alert(t('parsedOk'))
  } else {
    alert(t('parseFail'))
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
  if (!ensureAuth()) return
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const region = document.getElementById('region').value
  const language = document.getElementById('resumeLanguage').value
  const res = await fetch(apiBase + '/api/compare', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ profile, vacancyText, tone: 'concise', region, language }) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to compare')
  document.getElementById('analysis').textContent = JSON.stringify(j.analysis, null, 2)
  document.getElementById('result').textContent = JSON.stringify(j.resume, null, 2)
  document.getElementById('cover').textContent = j.coverLetter
  if (j.atsMatch !== undefined) {
    document.getElementById('analysis').textContent += `\n\nATS Match: ${j.atsMatch}%\nRisk Flags: ${JSON.stringify(j.riskFlags || [])}`
  }
})

document.getElementById('exportText').addEventListener('click', async () => {
  if (!ensureAuth()) return
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const region = document.getElementById('region').value
  const language = document.getElementById('resumeLanguage').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ profile, vacancyText, region, language }) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to generate')
  const r = await fetch(apiBase + '/api/export/text', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ resume: j.resume }) })
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
  if (!ensureAuth()) return
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const region = document.getElementById('region').value
  const language = document.getElementById('resumeLanguage').value
  const res = await fetch(apiBase + '/api/generate/resume', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ profile, vacancyText, region, language }) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to generate')
  const r = await fetch(apiBase + '/api/export/pdf', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ resume: j.resume }) })
  const blob = await r.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (profile.fullName || 'resume') + '.pdf'
  a.click()
})

// Interview prep
document.getElementById('interviewBtn')?.addEventListener('click', async () => {
  if (!ensureAuth()) return
  let profile
  try { profile = JSON.parse(document.getElementById('profile').value) } catch(e){ alert('Invalid JSON'); return }
  const vacancyText = document.getElementById('vacancy').value
  const res = await fetch(apiBase + '/api/interview', { method:'POST', headers:authHeaders({'Content-Type':'application/json'}), body: JSON.stringify({ profile, vacancyText }) })
  const j = await res.json()
  if (!res.ok) return alert(j.error || 'Failed to generate interview prep')
  alert('Interview questions:\n' + JSON.stringify(j, null, 2))
})

document.getElementById('appLanguage')?.addEventListener('change', () => {
  applyAppLanguage()
  updateAuthStatus()
  if (currentView === 'history' && authToken) loadHistory()
})

applyTheme()
applyAppLanguage()
updateAuthStatus()
setView('builder')
