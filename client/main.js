const apiBase = 'http://localhost:4000'

let authToken = localStorage.getItem('authToken') || ''
let theme = localStorage.getItem('theme') || 'light'
let currentView = 'landing'
let currentAuthMode = 'login'

const i18n = {
  EN: {
    documentTitle: 'AI Resume Generator — MVP',
    pageTitle: 'AI Resume Generator',
    topEyebrow: 'Truthful AI Application Platform',
    topSubtitle: 'Tailored resumes and cover letters with No Lies Mode, locale controls, and explainable edits.',
    landingTitle: 'Truthful AI application workflow for modern job seekers',
    landingText: 'Build a master career profile, tailor resumes and cover letters for each vacancy, and keep a history of every upload, query, and generated version. No fake claims. No hidden automation. Just explainable, market-aware job documents.',
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
    historyRecentActivity: 'Recent activity',
    loginRequiredTitle: 'Login required',
    loginRequiredText: 'Register or log in above to unlock uploads, generation, exports, and history.',
    darkLabel: 'Dark',
    lightLabel: 'Light',
    langEn: 'English',
    langRu: 'Russian',
    langEs: 'Spanish',
    notLoggedIn: 'Not logged in',
    loggedInAs: 'Logged in as',
    needLogin: 'Please login first',
    chooseFile: 'Choose a file',
    parsedOk: 'Parsed resume - review and save the profile',
    parseFail: 'Failed to parse resume',
    passwordRules: 'Password must be 8+ chars, include upper and lower case, a number and a special character.',
    confirmPassword: 'Repeat password',
    restorePassword: 'Restore password',
    restorePasswordHint: 'Email already registered. If you forgot your password, try logging in or restore it.',
    emailExists: 'Email already registered',
    passwordMismatch: 'Passwords do not match',
    registering: 'Registering...',
    loggingIn: 'Logging in...',
    registerSuccess: 'Registration successful. Please log in.',
    loginSuccess: 'Login successful.',
    invalidCredentials: 'Invalid email or password',
    registerFailed: 'Register failed',
    loginFailed: 'Login failed',
    serverUnreachable: 'server unreachable',
    loggedOut: 'Logged out.',
    loadingHistory: 'Loading...',
    failedLoadHistory: 'Failed to load history'
  },
  RU: {
    documentTitle: 'AI генератор резюме — MVP',
    pageTitle: 'AI генератор резюме',
    topEyebrow: 'Прозрачная AI-платформа для карьеры',
    topSubtitle: 'Адаптированные резюме и сопроводительные письма с No Lies Mode, выбором локали и понятными правками.',
    landingTitle: 'Прозрачный AI-процесс для современного поиска работы',
    landingText: 'Создайте мастер-профиль карьеры, адаптируйте резюме и сопроводительные письма под каждую вакансию и сохраняйте историю загрузок, запросов и сгенерированных версий. Без фейковых фактов. Без скрытой магии. Только объяснимые и контекстные документы.',
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
    historyRecentActivity: 'Последняя активность',
    loginRequiredTitle: 'Требуется вход',
    loginRequiredText: 'Зарегистрируйтесь или войдите выше, чтобы разблокировать загрузку, генерацию, экспорт и историю.',
    darkLabel: 'Темная',
    lightLabel: 'Светлая',
    langEn: 'Английский',
    langRu: 'Русский',
    langEs: 'Испанский',
    notLoggedIn: 'Не выполнен вход',
    loggedInAs: 'Вход выполнен:',
    needLogin: 'Сначала выполните вход',
    chooseFile: 'Выберите файл',
    parsedOk: 'Резюме распознано - проверьте и сохраните профиль',
    parseFail: 'Не удалось распознать резюме',
    passwordRules: 'Пароль должен быть не менее 8 символов, содержать заглавные и строчные буквы, цифру и спецсимвол.',
    confirmPassword: 'Повторите пароль',
    restorePassword: 'Восстановить пароль',
    restorePasswordHint: 'Email уже зарегистрирован. Если вы забыли пароль, войдите или восстановите его.',
    emailExists: 'Email уже зарегистрирован',
    passwordMismatch: 'Пароли не совпадают',
    registering: 'Регистрация...',
    loggingIn: 'Вход...',
    registerSuccess: 'Регистрация успешна. Теперь войдите.',
    loginSuccess: 'Вход выполнен.',
    invalidCredentials: 'Неверный email или пароль',
    registerFailed: 'Ошибка регистрации',
    loginFailed: 'Ошибка входа',
    serverUnreachable: 'сервер недоступен',
    loggedOut: 'Вы вышли из системы.',
    loadingHistory: 'Загрузка...',
    failedLoadHistory: 'Не удалось загрузить историю'
  },
  ES: {
    documentTitle: 'Generador de CV con IA — MVP',
    pageTitle: 'Generador de CV con IA',
    topEyebrow: 'Plataforma de carrera con IA transparente',
    topSubtitle: 'CV y cartas de presentación adaptados con No Lies Mode, controles de idioma y ediciones explicables.',
    landingTitle: 'Flujo de trabajo de IA transparente para quienes buscan empleo',
    landingText: 'Cree un perfil profesional maestro, adapte CV y cartas de presentación para cada vacante y conserve el historial de cada carga, consulta y versión generada. Sin afirmaciones falsas. Sin automatización oculta. Solo documentos explicables y adaptados al mercado.',
    authTitle: 'Autenticación',
    localeTitle: 'Localización',
    profileTitle: 'Perfil maestro',
    uploadLabel: 'Suba el CV (PDF o DOCX):',
    pasteLabel: 'O pegue el texto de su CV:',
    regionLabel: 'País/región objetivo',
    vacancyTitle: 'Texto de la vacante',
    compareTitle: 'Comparar y resultados generados',
    analysisTitle: 'Análisis del puesto',
    resumeTitle: 'CV generado',
    coverTitle: 'Carta de presentación generada',
    appLanguageLabel: 'Idioma de la interfaz',
    resumeLanguageLabel: 'Idioma del CV',
    namePlaceholder: 'Nombre',
    emailPlaceholder: 'Correo electrónico',
    passwordPlaceholder: 'Contraseña',
    profilePlaceholder: 'Pegue el texto del CV o el perfil JSON',
    vacancyPlaceholder: 'Pegue el texto o URL de la vacante',
    registerBtn: 'Registrarse',
    loginBtn: 'Entrar',
    logoutBtn: 'Salir',
    uploadResume: 'Subir y analizar',
    saveProfile: 'Guardar perfil',
    importSample: 'Cargar perfil de ejemplo',
    importVacancy: 'Cargar vacante de ejemplo',
    analyze: 'Analizar vacante',
    generate: 'Generar CV',
    compare: 'Comparar (análisis + resultados)',
    exportText: 'Exportar texto',
    exportPdf: 'Exportar PDF',
    interviewBtn: 'Generar preparación para entrevista',
    quickStartTitle: 'Inicio rápido',
    quickStartText: 'Cargue datos de ejemplo, ejecute el análisis y vea cómo su perfil se adapta a distintos mercados.',
    historyTitle: 'Historial',
    historyEmpty: 'Todavía no hay historial. Suba, genere o analice algo y aparecerá aquí.',
    builderTab: 'Constructor',
    historyTab: 'Historial',
    recentActivity: 'Actividad reciente',
    historyRecentActivity: 'Actividad reciente',
    loginRequiredTitle: 'Se requiere inicio de sesión',
    loginRequiredText: 'Regístrese o inicie sesión arriba para desbloquear cargas, generación, exportaciones e historial.',
    darkLabel: 'Oscuro',
    lightLabel: 'Claro',
    langEn: 'Inglés',
    langRu: 'Ruso',
    langEs: 'Español',
    notLoggedIn: 'No ha iniciado sesión',
    loggedInAs: 'Conectado como',
    needLogin: 'Primero inicie sesión',
    chooseFile: 'Elija un archivo',
    parsedOk: 'CV analizado - revise y guarde el perfil',
    parseFail: 'No se pudo analizar el CV',
    passwordRules: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas y minúsculas, un número y un símbolo especial.',
    confirmPassword: 'Repita la contraseña',
    restorePassword: 'Restaurar contraseña',
    restorePasswordHint: 'El correo ya está registrado. Si olvidó su contraseña, inicie sesión o restáurela.',
    emailExists: 'El correo ya está registrado',
    passwordMismatch: 'Las contraseñas no coinciden',
    registering: 'Registrando...',
    loggingIn: 'Iniciando sesión...',
    registerSuccess: 'Registro exitoso. Ahora inicie sesión.',
    loginSuccess: 'Sesión iniciada.',
    invalidCredentials: 'Correo o contraseña inválidos',
    registerFailed: 'Error al registrarse',
    loginFailed: 'Error al iniciar sesión',
    serverUnreachable: 'servidor no disponible',
    loggedOut: 'Sesión cerrada.',
    loadingHistory: 'Cargando...',
    failedLoadHistory: 'No se pudo cargar el historial'
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

function validatePassword(p) {
  if (!p || p.length < 8) return { ok: false, msg: 'Minimum 8 characters' }
  if (!/[a-z]/.test(p)) return { ok: false, msg: 'Include a lower-case letter' }
  if (!/[A-Z]/.test(p)) return { ok: false, msg: 'Include an upper-case letter' }
  if (!/[0-9]/.test(p)) return { ok: false, msg: 'Include a number' }
  if (!/[!@#$%^&*()_+\-=[\]{};:\"\\|,.<>/?]/.test(p)) return { ok: false, msg: 'Include a special character' }
  return { ok: true }
}

function showFieldError(el, message) {
  if (!el) return
  el.classList.add('input-error')
  const help = document.getElementById(el.id === 'authPassword' ? 'passwordHelp' : 'emailHelp')
  if (help) { help.textContent = message; help.classList.add('error') }
}

function clearFieldError(el) {
  if (!el) return
  el.classList.remove('input-error')
  const help = document.getElementById(el.id === 'authPassword' ? 'passwordHelp' : 'emailHelp')
  if (help) {
    if (el.id === 'authPassword') {
      help.textContent = t('passwordRules')
    } else {
      help.innerHTML = '&nbsp;'
    }
    help.classList.remove('error')
  }
}

function clearConfirmError() {
  const confirmEl = document.getElementById('authPasswordConfirm')
  const confirmHelp = document.getElementById('confirmHelp')
  if (confirmEl) confirmEl.classList.remove('input-error')
  if (confirmHelp) confirmHelp.innerHTML = '&nbsp;'
}

function restorePasswordFlow(email) {
  // Simple client-side hint — server-side reset not implemented
  setAuthNotice(t('restorePasswordHint'), 'error')
  const emailHelp = document.getElementById('emailHelp')
  if (emailHelp) emailHelp.innerHTML = `${t('emailExists')} — <a href="mailto:support@example.com?subject=Password%20reset%20for%20${encodeURIComponent(email)}">${t('restorePassword')}</a>`
}

function setAuthNotice(message, kind = '') {
  const el = document.getElementById('authNotice')
  if (!el) return
  el.textContent = message || ''
  el.classList.remove('error', 'success')
  if (kind) el.classList.add(kind)
}

function setView(view) {
  currentView = view
  const landingView = document.getElementById('landingView')
  const accountView = document.getElementById('accountView')
  const builderView = document.getElementById('builderView')
  const historyView = document.getElementById('historyView')
  const builderTab = document.getElementById('builderTab')
  const historyTab = document.getElementById('historyTab')
  const isLanding = view === 'landing'
  if (landingView) landingView.classList.toggle('hidden', !isLanding)
  if (accountView) accountView.classList.toggle('hidden', isLanding)
  if (builderView) builderView.classList.toggle('hidden', isLanding || view !== 'builder')
  if (historyView) historyView.classList.toggle('hidden', isLanding || view !== 'history')
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
}

async function loadHistory() {
  const list = document.getElementById('historyList')
  if (!list) return
  if (!authToken) {
    list.innerHTML = `<div class="history-empty">${t('needLogin')}</div>`
    return
  }
  list.innerHTML = `<div class="history-empty">${t('loadingHistory')}</div>`
  const res = await fetch(apiBase + '/api/history', { headers: authHeaders() })
  const j = await res.json()
  if (!res.ok) {
    list.innerHTML = `<div class="history-empty">${j.error || t('failedLoadHistory')}</div>`
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
  const accountStatus = document.getElementById('accountStatus')
  if (accountStatus) {
    accountStatus.textContent = authToken ? `${t('loggedInAs')} ${userEmail || localStorage.getItem('userEmail') || ''}` : t('notLoggedIn')
  }
  setWorkflowEnabled(!!authToken)

  // Hide the small account-actions block on the auth (login/register) page when not authenticated
  const accountActions = document.querySelector('.account-actions')
  if (accountActions) accountActions.style.display = authToken ? '' : 'none'
}

function applyAppLanguage() {
  document.title = t('documentTitle')
  const map = [
    ['topEyebrow', 'topEyebrow'],
    ['topSubtitle', 'topSubtitle'],
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
    ['resumeLanguageLabel', 'resumeLanguageLabel'],
    ['historyRecentActivity', 'historyRecentActivity']
  ]
  map.forEach(([id, key]) => {
    const el = document.getElementById(id)
    if (el) el.textContent = t(key)
  })

  // Headline and supporting text
  const h1 = document.querySelector('h1')
  if (h1) h1.textContent = t('pageTitle')
  const landingTitle = document.querySelector('.landing-title')
  const landingText = document.querySelector('.landing-text')
  if (landingTitle) landingTitle.textContent = t('landingTitle')
  if (landingText) landingText.textContent = t('landingText')
  const quickTitle = document.getElementById('quickStartTitle')
  if (quickTitle) quickTitle.textContent = t('quickStartTitle')
  const quickText = document.getElementById('quickStartText')
  if (quickText) quickText.textContent = t('quickStartText')

  // Placeholders
  const authName = document.getElementById('authName')
  const authEmail = document.getElementById('authEmail')
  const authPassword = document.getElementById('authPassword')
  const authPasswordConfirm = document.getElementById('authPasswordConfirm')
  const profile = document.getElementById('profile')
  const vacancy = document.getElementById('vacancy')
  if (authName) authName.placeholder = t('namePlaceholder')
  if (authEmail) authEmail.placeholder = t('emailPlaceholder')
  if (authPassword) authPassword.placeholder = t('passwordPlaceholder')
  if (authPasswordConfirm) authPasswordConfirm.placeholder = t('confirmPassword')
  if (profile) profile.placeholder = t('profilePlaceholder')
  if (vacancy) vacancy.placeholder = t('vacancyPlaceholder')

  const passwordHelp = document.getElementById('passwordHelp')
  const confirmField = document.getElementById('fieldConfirm')
  const restorePasswordBlock = document.getElementById('restorePasswordBlock')
  const restorePasswordLink = document.getElementById('restorePasswordLink')
  if (currentAuthMode === 'register') {
    if (passwordHelp) {
      passwordHelp.textContent = t('passwordRules')
      passwordHelp.style.display = 'block'
    }
    if (confirmField) confirmField.style.display = ''
    if (restorePasswordBlock) restorePasswordBlock.style.display = 'none'
    if (restorePasswordLink) restorePasswordLink.style.display = 'none'
  } else {
    if (passwordHelp) passwordHelp.style.display = 'none'
    if (confirmField) confirmField.style.display = 'none'
    if (restorePasswordBlock) restorePasswordBlock.style.display = 'block'
    if (restorePasswordLink) restorePasswordLink.style.display = 'inline'
  }

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
  const restorePasswordLink = document.getElementById('restorePasswordLink')
  if (restorePasswordLink) restorePasswordLink.textContent = t('restorePassword')
  const historyEmpty = document.querySelector('.history-empty')
  if (historyEmpty && !authToken) historyEmpty.textContent = t('needLogin')
  const currentHistoryList = document.getElementById('historyList')
  if (currentHistoryList && currentView === 'history' && authToken) loadHistory()
  setAuthMode(currentAuthMode)
}

function applyTheme() {
  document.body.setAttribute('data-theme', theme)
  const themeToggle = document.getElementById('themeToggle')
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? t('lightLabel') : t('darkLabel')
  }
}

document.getElementById('registerBtn')?.addEventListener('click', async () => {
  await submitRegister()
})

document.getElementById('loginBtn')?.addEventListener('click', async () => {
  await submitLogin()
})

document.getElementById('logoutBtn')?.addEventListener('click', () => {
  authToken = ''
  localStorage.removeItem('authToken')
  localStorage.removeItem('userEmail')
  updateAuthStatus('')
  setAuthNotice(t('loggedOut'))
  const historyList = document.getElementById('historyList')
  if (historyList) historyList.innerHTML = `<div class="history-empty">${t('needLogin')}</div>`
  setView('landing')
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
setView(authToken ? 'builder' : 'landing')

// Auth tab handling: switch between Login and Register views
function setAuthMode(mode) {
  currentAuthMode = mode
  const loginTab = document.getElementById('authTabLogin')
  const registerTab = document.getElementById('authTabRegister')
  const nameField = document.getElementById('fieldName')
  const confirmField = document.getElementById('fieldConfirm')
  const registerBtn = document.getElementById('registerBtn')
  const loginBtn = document.getElementById('loginBtn')
  const passwordHelp = document.getElementById('passwordHelp')
  const emailHelp = document.getElementById('emailHelp')
  const nameHelp = document.getElementById('nameHelp')
  const restorePasswordBlock = document.getElementById('restorePasswordBlock')
  const restorePasswordLink = document.getElementById('restorePasswordLink')
  if (mode === 'login') {
    loginTab && loginTab.classList.add('active')
    registerTab && registerTab.classList.remove('active')
    if (nameField) nameField.style.display = 'none'
    if (confirmField) confirmField.style.display = 'none'
    if (registerBtn) registerBtn.style.display = 'none'
    if (loginBtn) loginBtn.style.display = ''
    if (passwordHelp) passwordHelp.style.display = 'none'
    if (nameHelp) nameHelp.innerHTML = '&nbsp;'
    if (restorePasswordBlock) restorePasswordBlock.style.display = 'block'
    if (restorePasswordLink) restorePasswordLink.style.display = 'inline'
    clearFieldError(document.getElementById('authEmail'))
    clearFieldError(document.getElementById('authPassword'))
    clearConfirmError()
    document.getElementById('authPassword').placeholder = t('passwordPlaceholder')
  } else {
    registerTab && registerTab.classList.add('active')
    loginTab && loginTab.classList.remove('active')
    if (nameField) nameField.style.display = ''
    if (confirmField) confirmField.style.display = ''
    if (registerBtn) registerBtn.style.display = ''
    if (loginBtn) loginBtn.style.display = 'none'
    if (passwordHelp) {
      passwordHelp.textContent = t('passwordRules')
      passwordHelp.style.display = 'block'
    }
    if (emailHelp && !emailHelp.textContent) emailHelp.innerHTML = '&nbsp;'
    if (nameHelp) nameHelp.innerHTML = '&nbsp;'
    if (restorePasswordBlock) restorePasswordBlock.style.display = 'none'
    if (restorePasswordLink) restorePasswordLink.style.display = 'none'
    document.getElementById('authPassword').placeholder = t('passwordPlaceholder')
  }
}

document.getElementById('authTabLogin')?.addEventListener('click', () => setAuthMode('login'))
document.getElementById('authTabRegister')?.addEventListener('click', () => setAuthMode('register'))

document.getElementById('authForm')?.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return
  const targetTag = event.target?.tagName?.toLowerCase()
  if (targetTag === 'textarea') return
  event.preventDefault()
  if (currentAuthMode === 'register') submitRegister()
  else submitLogin()
})

async function submitRegister() {
  const nameEl = document.getElementById('authName')
  const emailEl = document.getElementById('authEmail')
  const passwordEl = document.getElementById('authPassword')
  const confirmEl = document.getElementById('authPasswordConfirm')
  const email = emailEl.value.trim()
  const name = nameEl.value.trim()
  const password = passwordEl.value
  const passwordConfirm = confirmEl.value
  clearFieldError(emailEl)
  clearFieldError(passwordEl)
  clearConfirmError()
  const v = validatePassword(password)
  if (!v.ok) {
    showFieldError(passwordEl, v.msg)
    setAuthNotice(t('passwordRules'), 'error')
    return
  }
  if (password !== passwordConfirm) {
    confirmEl.classList.add('input-error')
    const confirmHelp = document.getElementById('confirmHelp')
    if (confirmHelp) {
      confirmHelp.textContent = t('passwordMismatch')
      confirmHelp.classList.add('error')
    }
    setAuthNotice(t('passwordMismatch'), 'error')
    return
  }
  try {
    setAuthNotice(t('registering'))
    const res = await fetch(apiBase + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const j = await (res.headers.get('content-type') || '').includes('application/json') ? await res.json() : {}
    if (!res.ok) {
      if (j && j.error === 'user_exists') {
        showFieldError(emailEl, t('emailExists'))
        restorePasswordFlow(email)
        return
      }
      setAuthNotice(j.error || t('registerFailed'), 'error')
      return
    }
    setAuthNotice(t('registerSuccess'), 'success')
    passwordEl.value = ''
    confirmEl.value = ''
    const emailHelp = document.getElementById('emailHelp')
    if (emailHelp) emailHelp.innerHTML = '&nbsp;'
  } catch (error) {
    setAuthNotice(`${t('registerFailed')}: ${t('serverUnreachable')}`, 'error')
  }
}

async function submitLogin() {
  const nameEl = document.getElementById('authName')
  if (nameEl) nameEl.style.display = 'none'
  const emailEl = document.getElementById('authEmail')
  const passwordEl = document.getElementById('authPassword')
  clearFieldError(emailEl)
  clearFieldError(passwordEl)
  clearConfirmError()
  const email = emailEl.value.trim()
  const password = passwordEl.value
  try {
    setAuthNotice(t('loggingIn'))
    const res = await fetch(apiBase + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const j = await (res.headers.get('content-type') || '').includes('application/json') ? await res.json() : {}
    if (!res.ok) {
      if (j && j.error === 'invalid_credentials') {
        setAuthNotice(t('invalidCredentials'), 'error')
        restorePasswordFlow(email)
      } else {
        setAuthNotice(j.error || t('loginFailed'), 'error')
      }
      return
    }
    authToken = j.token
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('userEmail', j.user.email)
    setAuthNotice(t('loginSuccess'), 'success')
    updateAuthStatus(j.user.email)
    setView('builder')
  } catch (error) {
    setAuthNotice(`${t('loginFailed')}: ${t('serverUnreachable')}`, 'error')
  }
}

// Initialize auth mode default
setAuthMode('login')
