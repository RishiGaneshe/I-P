// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  API_BASE: "https://ip.codewithrishi.fun/api/profile",
  SEARCH_API_BASE: "https://ip.codewithrishi.fun/api",
  AUTH_ENABLED: false,
  DEBOUNCE_DELAY: 300
}

// ============================================
// STATE MANAGEMENT
// ============================================
let state = {
  originalData: null,
  isEditing: false,
  isLoading: false,
  error: null,
  searchExplorerOpen: false,
  currentSearchTab: 'topSkills',
  topSkills: [],
  searchResults: [],
  skillProjectsData: null,
  globalSearchData: null,
  currentPage: 1,
  currentSkillQuery: ''
}

// Debounce utility
let debounceTimer = null
function debounce(func, delay) {
  return function(...args) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(this, args), delay)
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidUrl(url) {
  if (!url) return true
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (CONFIG.AUTH_ENABLED) {
    const token = localStorage.getItem('authToken')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// ============================================
// SEARCH API FUNCTIONS
// ============================================

async function fetchTopSkills() {
  try {
    const response = await fetch(`${CONFIG.SEARCH_API_BASE}/skills/top`, {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = await response.json()
    
    if (!json.success || !json.data) {
      throw new Error('Failed to fetch top skills')
    }

    state.topSkills = json.data
    renderTopSkills()

  } catch (error) {
    console.error('Top skills error:', error)
    document.getElementById('searchContent').innerHTML = `
      <div class="error">Failed to load top skills: ${escapeHtml(error.message)}</div>
    `
  }
}

async function searchProjectsBySkill(skill, page = 1) {
  try {
    const limit = 10
    const offset = (page - 1) * limit

    const response = await fetch(
      `${CONFIG.SEARCH_API_BASE}/projects?skill=${encodeURIComponent(skill)}&limit=${limit}&offset=${offset}`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = await response.json()

    if (!json.success) {
      throw new Error('Failed to search projects')
    }

    state.skillProjectsData = json
    state.currentPage = page
    state.currentSkillQuery = skill
    renderSkillProjects()

  } catch (error) {
    console.error('Skill search error:', error)
    document.getElementById('searchContent').innerHTML = `
      <div class="error">Failed to search projects: ${escapeHtml(error.message)}</div>
    `
  }
}

async function performGlobalSearch(query) {
  if (!query || query.length < 2) {
    document.getElementById('globalSearchResults').classList.remove('active')
    return
  }

  try {
    document.getElementById('globalSearchResults').innerHTML = `
      <div class="search-loading">Searching...</div>
    `
    document.getElementById('globalSearchResults').classList.add('active')

    const response = await fetch(
      `${CONFIG.SEARCH_API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`,
      { headers: getHeaders() }
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const json = await response.json()

    if (!json.success) {
      throw new Error('Search failed')
    }

    renderGlobalSearchResults(json.data)

  } catch (error) {
    console.error('Global search error:', error)
    document.getElementById('globalSearchResults').innerHTML = `
      <div class="error">Search failed: ${escapeHtml(error.message)}</div>
    `
  }
}

// ============================================
// PROFILE API FUNCTIONS
// ============================================

async function fetchProfile() {
  try {
    state.isLoading = true
    state.error = null
    render()

    const response = await fetch(CONFIG.API_BASE, {
      headers: getHeaders()
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const json = await response.json()

    if (!json.success || !json.data) {
      throw new Error('Invalid response format')
    }

    state.originalData = json.data
    state.isLoading = false
    render()

  } catch (error) {
    console.error('Fetch error:', error)
    state.error = `Failed to load profile: ${error.message}`
    state.isLoading = false
    render()
  }
}

async function updateProfile(changes) {
  try {
    state.isLoading = true
    render()

    const response = await fetch(CONFIG.API_BASE, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(changes)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const json = await response.json()

    state.originalData = { ...state.originalData, ...changes }
    state.isEditing = false
    state.isLoading = false
    state.error = null

    render()
    showMessage('Profile updated successfully!', 'success')

    setTimeout(() => fetchProfile(), 1000)

  } catch (error) {
    console.error('Update error:', error)
    state.error = `Failed to update profile: ${error.message}`
    state.isLoading = false
    render()
  }
}

// ============================================
// SEARCH UI FUNCTIONS
// ============================================

function toggleSearchExplorer() {
  state.searchExplorerOpen = !state.searchExplorerOpen
  const explorer = document.getElementById('searchExplorer')
  
  if (state.searchExplorerOpen) {
    explorer.style.display = 'block'
    if (state.currentSearchTab === 'topSkills' && state.topSkills.length === 0) {
      fetchTopSkills()
    }
  } else {
    explorer.style.display = 'none'
  }
}

function switchSearchTab(tab) {
  state.currentSearchTab = tab
  
  // Update tab styles
  document.querySelectorAll('.search-tab').forEach(t => {
    t.classList.remove('active')
  })
  event.target.classList.add('active')

  // Load content based on tab
  if (tab === 'topSkills') {
    if (state.topSkills.length === 0) {
      fetchTopSkills()
    } else {
      renderTopSkills()
    }
  } else if (tab === 'bySkill') {
    renderSkillSearchForm()
  }
}

function renderTopSkills() {
  const content = document.getElementById('searchContent')
  
  if (!state.topSkills || state.topSkills.length === 0) {
    content.innerHTML = '<div class="search-empty">No skills data available</div>'
    return
  }

  content.innerHTML = `
    <div class="top-skills-list">
      ${state.topSkills.map(skill => `
        <div class="top-skill-item" onclick="searchProjectsBySkillFromTop('${escapeHtml(skill.name)}')">
          <div class="top-skill-name">${escapeHtml(skill.name)}</div>
        </div>
      `).join('')}
    </div>
  `
}

function searchProjectsBySkillFromTop(skillName) {
  state.currentSearchTab = 'bySkill'
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'))
  document.querySelectorAll('.search-tab')[1].classList.add('active')
  
  renderSkillSearchForm(skillName)
  searchProjectsBySkill(skillName)
}

function renderSkillSearchForm(prefillSkill = '') {
  const content = document.getElementById('searchContent')
  
  content.innerHTML = `
    <div style="margin-bottom: 24px;">
      <input 
        type="text" 
        id="skillSearchInput" 
        placeholder="Enter skill name (e.g., nodejs, react, python)..."
        value="${escapeHtml(prefillSkill)}"
        style="max-width: 500px;"
      >
      <button class="btn btn-small" onclick="handleSkillSearch()" style="margin-left: 12px;">
        Search Projects
      </button>
    </div>
    <div id="skillProjectsResults"></div>
  `

  // Auto-search if prefilled
  if (prefillSkill) {
    document.getElementById('skillProjectsResults').innerHTML = `
      <div class="search-loading">Loading projects...</div>
    `
  }
}

function handleSkillSearch() {
  const skill = document.getElementById('skillSearchInput').value.trim()
  if (!skill) {
    showMessage('Please enter a skill name', 'error')
    return
  }
  searchProjectsBySkill(skill)
}

function renderSkillProjects() {
  const resultsDiv = document.getElementById('skillProjectsResults')
  const data = state.skillProjectsData

  if (!data || !data.data || data.data.length === 0) {
    resultsDiv.innerHTML = '<div class="search-empty">No projects found for this skill</div>'
    return
  }

  const totalPages = Math.ceil(data.count / 10)

  resultsDiv.innerHTML = `
    <div style="margin-bottom: 16px; color: var(--text-secondary); font-weight: 600;">
      Found ${data.count} project${data.count !== 1 ? 's' : ''}
    </div>

    <div class="skill-projects-list">
      ${data.data.map(project => `
        <div class="skill-project-card">
          <div class="skill-project-title">${escapeHtml(project.title || 'Untitled Project')}</div>
          <div class="skill-project-desc">${escapeHtml(project.description || 'No description available.')}</div>
          ${project.links && project.links.length > 0 ? `
            <div class="skill-project-links">
              ${project.links.map(link => `
                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="skill-project-link">
                  ${escapeHtml(link.label)}
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    ${totalPages > 1 ? `
      <div class="pagination">
        <button onclick="searchProjectsBySkill('${escapeHtml(state.currentSkillQuery)}', ${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>
          ← Previous
        </button>
        <span class="pagination-info">Page ${state.currentPage} of ${totalPages}</span>
        <button onclick="searchProjectsBySkill('${escapeHtml(state.currentSkillQuery)}', ${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>
          Next →
        </button>
      </div>
    ` : ''}
  `
}

function renderGlobalSearchResults(results) {
  const container = document.getElementById('globalSearchResults')

  if (!results || results.length === 0) {
    container.innerHTML = '<div class="search-empty">No results found</div>'
    return
  }

  container.innerHTML = results.map(item => `
    <div class="search-result-item">
      <div class="search-result-title">${escapeHtml(item.title || 'Untitled')}</div>
      <div class="search-result-meta">${escapeHtml(item.description || 'No description available.')}</div>
      ${item.links && item.links.length > 0 ? `
        <div class="search-result-links">
          ${item.links.map(link => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener" class="search-result-link">
              ${escapeHtml(link.label)}
            </a>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')
}

function clearGlobalSearch() {
  document.getElementById('globalSearchInput').value = ''
  document.getElementById('globalSearchResults').classList.remove('active')
  document.getElementById('searchClear').style.display = 'none'
}

// ============================================
// PROFILE UI FUNCTIONS
// ============================================

function showMessage(message, type = 'success') {
  const messageDiv = document.createElement('div')
  messageDiv.className = `toast ${type}`
  messageDiv.textContent = message
  
  document.body.appendChild(messageDiv)
  
  setTimeout(() => {
    messageDiv.remove()
  }, 3000)
}

function enterEditMode() {
  state.isEditing = true
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  state.isEditing = false
  state.error = null
  render()
}

async function saveChanges() {
  const formData = getFormData()
  const validation = validateFormData(formData)
  
  if (!validation.valid) {
    state.error = validation.error
    render()
    return
  }

  const changes = calculateChanges(formData)

  if (Object.keys(changes).length === 0) {
    showMessage('No changes detected', 'error')
    return
  }

  await updateProfile(changes)
}

function getFormData() {
  return {
    name: document.getElementById('name')?.value.trim() || '',
    email: document.getElementById('email')?.value.trim() || '',
    education: document.getElementById('education')?.value.trim() || '',
    github: document.getElementById('github')?.value.trim() || '',
    linkedin: document.getElementById('linkedin')?.value.trim() || '',
    portfolio: document.getElementById('portfolio')?.value.trim() || '',
    skills: document.getElementById('skills')?.value
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean) || []
  }
}

function validateFormData(data) {
  if (!data.name) return { valid: false, error: 'Name is required' }
  if (!data.email) return { valid: false, error: 'Email is required' }
  if (!isValidEmail(data.email)) return { valid: false, error: 'Invalid email format' }
  if (!isValidUrl(data.github)) return { valid: false, error: 'Invalid GitHub URL' }
  if (!isValidUrl(data.linkedin)) return { valid: false, error: 'Invalid LinkedIn URL' }
  if (!isValidUrl(data.portfolio)) return { valid: false, error: 'Invalid Portfolio URL' }
  if (data.skills.length === 0) return { valid: false, error: 'At least one skill is required' }

  return { valid: true }
}

function calculateChanges(formData) {
  const changes = {}
  const original = state.originalData

  if (formData.name !== original.name) changes.name = formData.name
  if (formData.email !== original.email) changes.email = formData.email
  if (formData.education !== (original.education || '')) changes.education = formData.education

  if (formData.github !== (original.github || '') ||
      formData.linkedin !== (original.linkedin || '') ||
      formData.portfolio !== (original.portfolio || '')) {
    changes.links = {
      github: formData.github,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio
    }
  }

  const originalSkills = original.skills.map(s => s.name.toLowerCase()).sort()
  const newSkills = [...formData.skills].sort()

  if (!deepEqual(originalSkills, newSkills)) {
    changes.skills = formData.skills
  }

  return changes
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function render() {
  const app = document.getElementById('app')

  if (state.isLoading && !state.originalData) {
    app.innerHTML = '<div class="loading">Loading profile</div>'
    return
  }

  if (state.error && !state.originalData) {
    app.innerHTML = `<div class="error">${escapeHtml(state.error)}</div>`
    return
  }

  if (!state.originalData) {
    app.innerHTML = '<div class="loading">No data available</div>'
    return
  }

  if (state.isEditing) {
    renderEditMode()
  } else {
    renderViewMode()
  }
}

function renderViewMode() {
  const data = state.originalData
  const app = document.getElementById('app')

  app.innerHTML = `
    ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ''}

    <div class="header">
      <div class="header-content">
        <h1>${escapeHtml(data.name || 'Name not provided')}</h1>
        <p class="subtitle">${escapeHtml(data.email || 'Email not provided')}</p>
        ${data.education ? `<p class="education">🎓 ${escapeHtml(data.education)}</p>` : ''}
        
        <div class="social-links">
          ${data.github ? `<a href="${escapeHtml(data.github)}" target="_blank" rel="noopener">💻 GitHub</a>` : ''}
          ${data.linkedin ? `<a href="${escapeHtml(data.linkedin)}" target="_blank" rel="noopener">💼 LinkedIn</a>` : ''}
          ${data.portfolio ? `<a href="${escapeHtml(data.portfolio)}" target="_blank" rel="noopener">🌐 Portfolio</a>` : ''}
        </div>

        <div style="margin-top: 40px;">
          <button class="btn" onclick="enterEditMode()" ${state.isLoading ? 'disabled' : ''}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>
    </div>

    ${data.skills && data.skills.length > 0 ? `
      <div class="card">
        <h2>Skills & Expertise</h2>
        <div class="skills-grid">
          ${data.skills.map(skill => 
            `<div class="skill-chip" onclick="searchProjectsBySkillFromTop('${escapeHtml(skill.name)}')" title="Click to find projects with this skill">
              ${escapeHtml(skill.name)}
            </div>`
          ).join('')}
        </div>
      </div>
    ` : ''}

    ${data.projects && data.projects.length > 0 ? `
      <div class="card">
        <h2>Featured Projects</h2>
        ${data.projects.map(project => `
          <div class="project-item">
            <h3>${escapeHtml(project.title || 'Untitled Project')}</h3>
            <p>${escapeHtml(project.description || 'No description available.')}</p>
            ${project.links && project.links.length > 0 ? `
              <div class="project-links">
                ${project.links.map(link => 
                  `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`
                ).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${data.workExperiences && data.workExperiences.length > 0 ? `
      <div class="card">
        <h2>Work Experience</h2>
        ${data.workExperiences.map(work => `
          <div class="work-item">
            <h3>${escapeHtml(work.company || 'Company not specified')}</h3>
            <p class="role">${escapeHtml(work.role || 'Role not specified')}</p>
            <p>${escapeHtml(work.description || 'No description available.')}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `
}

function renderEditMode() {
  const data = state.originalData
  const app = document.getElementById('app')

  app.innerHTML = `
    ${state.error ? `<div class="error">${escapeHtml(state.error)}</div>` : ''}

    <div class="header edit-header">
      <div class="header-content">
        <h1>✏️ Edit Your Profile</h1>
        <p class="subtitle">Update your information and showcase your work</p>
      </div>
    </div>

    <div class="card">
      <h2>Personal Information</h2>

      <div class="form-group">
        <label for="name">Full Name *</label>
        <input type="text" id="name" value="${escapeHtml(data.name || '')}" required>
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" value="${escapeHtml(data.email || '')}" required>
      </div>

      <div class="form-group">
        <label for="education">Education</label>
        <textarea id="education">${escapeHtml(data.education || '')}</textarea>
        <p class="input-hint">Include your degree, institution, and years</p>
      </div>
    </div>

    <div class="card">
      <h2>Professional Links</h2>

      <div class="form-group">
        <label for="github">GitHub Profile</label>
        <input type="url" id="github" value="${escapeHtml(data.github || '')}" placeholder="https://github.com/yourusername">
      </div>

      <div class="form-group">
        <label for="linkedin">LinkedIn Profile</label>
        <input type="url" id="linkedin" value="${escapeHtml(data.linkedin || '')}" placeholder="https://linkedin.com/in/yourusername">
      </div>

      <div class="form-group">
        <label for="portfolio">Portfolio Website</label>
        <input type="url" id="portfolio" value="${escapeHtml(data.portfolio || '')}" placeholder="https://yourportfolio.com">
      </div>
    </div>

    <div class="card">
      <h2>Skills</h2>

      <div class="form-group">
        <label for="skills">Your Skills *</label>
        <textarea id="skills" rows="3">${escapeHtml(data.skills && data.skills.length > 0 ? data.skills.map(s => s.name).join(', ') : '')}</textarea>
        <p class="input-hint">Separate skills with commas. Example: JavaScript, Python, Docker, AWS, PostgreSQL</p>
      </div>
    </div>

    <div class="card" style="background: var(--bg-secondary); border: 2px dashed var(--border);">
      <button class="btn" onclick="saveChanges()" ${state.isLoading ? 'disabled' : ''}>
        ${state.isLoading ? '⏳ Saving Changes...' : '💾 Save Changes'}
      </button>
      <button class="btn btn-secondary" onclick="cancelEdit()" ${state.isLoading ? 'disabled' : ''}>
        ❌ Cancel
      </button>
    </div>
  `
}

// ============================================
// EVENT LISTENERS
// ============================================

// Global search with debounce
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('globalSearchInput')
  const searchClear = document.getElementById('searchClear')

  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim()
    
    if (query.length > 0) {
      searchClear.style.display = 'block'
    } else {
      searchClear.style.display = 'none'
    }

    if (query.length >= 2) {
      performGlobalSearch(query)
    } else {
      document.getElementById('globalSearchResults').classList.remove('active')
    }
  }, CONFIG.DEBOUNCE_DELAY))

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.nav-search')
    if (searchContainer && !searchContainer.contains(e.target)) {
      document.getElementById('globalSearchResults').classList.remove('active')
    }
  })
})

// ============================================
// INITIALIZATION
// ============================================

window.onload = () => {
  fetchProfile()
}

// Make functions globally available
window.enterEditMode = enterEditMode
window.cancelEdit = cancelEdit
window.saveChanges = saveChanges
window.toggleSearchExplorer = toggleSearchExplorer
window.switchSearchTab = switchSearchTab
window.handleSkillSearch = handleSkillSearch
window.clearGlobalSearch = clearGlobalSearch
window.searchProjectsBySkillFromTop = searchProjectsBySkillFromTop
