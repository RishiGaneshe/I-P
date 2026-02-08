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
    currentPage: 1
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
  function escapeHtml(text){
    if(!text) return ''
    const div=document.createElement('div')
    div.textContent=text
    return div.innerHTML
  }
  
  function deepEqual(a,b){return JSON.stringify(a)===JSON.stringify(b)}
  function isValidEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
  function isValidUrl(u){ if(!u) return true; try{ new URL(u); return true }catch{return false}}
  
  function getHeaders(){
    const headers={'Content-Type':'application/json'}
    if(CONFIG.AUTH_ENABLED){
      const token=localStorage.getItem('authToken')
      if(token) headers['Authorization']=`Bearer ${token}`
    }
    return headers
  }
  
  // ============================================
  // PROFILE API
  // ============================================
  async function fetchProfile(){
    try{
      state.isLoading=true
      state.error=null
      render()
  
      const response=await fetch(CONFIG.API_BASE,{headers:getHeaders()})
      if(!response.ok) throw new Error(`HTTP ${response.status}`)
  
      const json=await response.json()
      if(!json.success||!json.data) throw new Error('Invalid response')
  
      state.originalData=json.data
      state.isLoading=false
      render()
  
    }catch(err){
      console.error(err)
      state.error=`Failed to load profile: ${err.message}`
      state.isLoading=false
      render()
    }
  }
  
  async function updateProfile(changes){
    try{
      state.isLoading=true
      render()
  
      const response=await fetch(CONFIG.API_BASE,{
        method:'PUT',
        headers:getHeaders(),
        body:JSON.stringify(changes)
      })
  
      if(!response.ok) throw new Error(`HTTP ${response.status}`)
      await response.json()
  
      state.originalData={...state.originalData,...changes}
      state.isEditing=false
      state.isLoading=false
      render()
      showMessage('Profile updated','success')
      setTimeout(fetchProfile,800)
  
    }catch(err){
      state.error=`Update failed: ${err.message}`
      state.isLoading=false
      render()
    }
  }
  
  // ============================================
  // SEARCH
  // ============================================
  async function performGlobalSearch(query){
    if(!query||query.length<2){
      document.getElementById('globalSearchResults').classList.remove('active')
      return
    }
  
    try{
      document.getElementById('globalSearchResults').innerHTML=`<div class="search-loading">Searching...</div>`
      document.getElementById('globalSearchResults').classList.add('active')
  
      const res=await fetch(`${CONFIG.SEARCH_API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`,{headers:getHeaders()})
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      const json=await res.json()
      if(!json.success) throw new Error('Search failed')
  
      renderGlobalSearchResults(json.data)
    }catch(e){
      document.getElementById('globalSearchResults').innerHTML=`<div class="error">${escapeHtml(e.message)}</div>`
    }
  }
  
  // ============================================
  // UI helpers
  // ============================================
  function showMessage(msg,type='success'){
    const d=document.createElement('div')
    d.className=`toast ${type}`
    d.textContent=msg
    document.body.appendChild(d)
    setTimeout(()=>d.remove(),3000)
  }
  
  function enterEditMode(){state.isEditing=true;render();window.scrollTo({top:0,behavior:'smooth'})}
  function cancelEdit(){state.isEditing=false;state.error=null;render()}
  
  // ============================================
  // RENDER
  // ============================================
  function render(){
    const app=document.getElementById('app')
  
    if(state.isLoading&&!state.originalData){app.innerHTML='<div class="loading">Loading profile</div>';return}
    if(state.error&&!state.originalData){app.innerHTML=`<div class="error">${escapeHtml(state.error)}</div>`;return}
    if(!state.originalData){app.innerHTML='<div class="loading">No data</div>';return}
  
    if(state.isEditing) renderEditMode()
    else renderViewMode()
  }
  
  function renderViewMode(){
    const data=state.originalData
    const app=document.getElementById('app')
  
    app.innerHTML=`
    <div class="header">
      <div class="header-content">
        <h1>${escapeHtml(data.name)}</h1>
        <p class="subtitle">${escapeHtml(data.email)}</p>
        ${data.education?`<p class="education">🎓 ${escapeHtml(data.education)}</p>`:''}
  
        <div class="social-links">
          ${data.github?`<a href="${escapeHtml(data.github)}" target="_blank">GitHub</a>`:''}
          ${data.linkedin?`<a href="${escapeHtml(data.linkedin)}" target="_blank">LinkedIn</a>`:''}
        </div>
  
        <div style="margin-top:30px">
          <button class="btn" onclick="enterEditMode()">Edit Profile</button>
        </div>
      </div>
    </div>
    `
  }
  
  function renderEditMode(){
    const data=state.originalData
    const app=document.getElementById('app')
  
    app.innerHTML=`
    <div class="card">
      <h2>Edit</h2>
      <input id="name" value="${escapeHtml(data.name)}"/>
      <input id="email" value="${escapeHtml(data.email)}"/>
      <button class="btn" onclick="saveChanges()">Save</button>
      <button class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
    </div>`
  }
  
  async function saveChanges(){
    const name=document.getElementById('name').value.trim()
    const email=document.getElementById('email').value.trim()
    if(!name||!isValidEmail(email)){showMessage('Invalid input','error');return}
    await updateProfile({name,email})
  }
  
  function renderGlobalSearchResults(results){
    const container=document.getElementById('globalSearchResults')
    if(!results||results.length===0){
      container.innerHTML='<div class="search-empty">No results</div>';return
    }
    container.innerHTML=results.map(r=>`
    <div class="search-result-item">
      <div class="search-result-title">${escapeHtml(r.title)}</div>
      <div class="search-result-meta">${escapeHtml(r.description||'')}</div>
    </div>`).join('')
  }
  
  function clearGlobalSearch(){
    document.getElementById('globalSearchInput').value=''
    document.getElementById('globalSearchResults').classList.remove('active')
    document.getElementById('searchClear').style.display='none'
  }
  
  // ============================================
  // EVENTS
  // ============================================
  document.addEventListener('DOMContentLoaded',()=>{
    const searchInput=document.getElementById('globalSearchInput')
    const searchClear=document.getElementById('searchClear')
  
    if(searchInput){
      searchInput.addEventListener('input',debounce(e=>{
        const q=e.target.value.trim()
        searchClear.style.display=q?'block':'none'
        if(q.length>=2) performGlobalSearch(q)
        else document.getElementById('globalSearchResults').classList.remove('active')
      },CONFIG.DEBOUNCE_DELAY))
    }
  })
  
  // ============================================
  // INIT
  // ============================================
  window.onload=()=>{fetchProfile()}
  
  // expose globals
  window.enterEditMode=enterEditMode
  window.cancelEdit=cancelEdit
  window.saveChanges=saveChanges
  window.clearGlobalSearch=clearGlobalSearch
  