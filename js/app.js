// ─────────────────────────────────────────────
// SETTINGS PAGE (continued from inline)
// ─────────────────────────────────────────────
// Called from showSettingsPage() inline HTML
function _settingsPageItems() {
  return [
    ['🔔','Notifications','Sounds, vibration, badges','showNotifsModal()'],
    ['💬','Chat Settings','Font size, wallpaper, bubbles','showSettingsModal()'],
    ['⭐','Starred Messages','Your saved messages','showStarredMessages()'],
    ['🔒','Privacy','Read receipts, online status','showSettingsModal()'],
    ['ℹ️','About Leafy','Version 4.0 · Sematech Developers',"toast('Leafy v4.0 — Built with ❤️ by Sematech Developers 🌿','info')"],
  ]
}

// ─────────────────────────────────────────────
// MOBILE NAVIGATION
// ─────────────────────────────────────────────
let mobilePage = 'chats'

function mobileTab(tab) {
  mobilePage = tab
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'))
  document.getElementById('nav-' + tab)?.classList.add('active')
  document.getElementById('stories-bar').style.display = ''

  const sidebar  = document.getElementById('sidebar')
  const mainArea = document.getElementById('main-area-el')

  if (tab === 'chats') {
    sidebar.classList.add('mobile-open')
    mainArea.classList.remove('chat-mode')
    showBottomNav()
    renderConversations()
  } else if (tab === 'groups') {
    sidebar.classList.add('mobile-open')
    mainArea.classList.remove('chat-mode')
    switchTab('groups')
    showBottomNav()
  } else if (tab === 'status') {
    sidebar.classList.remove('mobile-open')
    mainArea.classList.add('chat-mode')
    showStatusPage()
    showBottomNav()
  } else if (tab === 'calls') {
    sidebar.classList.remove('mobile-open')
    mainArea.classList.add('chat-mode')
    showCallsPage()
    showBottomNav()
  } else if (tab === 'settings') {
    sidebar.classList.remove('mobile-open')
    mainArea.classList.add('chat-mode')
    showSettingsPage()
    showBottomNav()
  }
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('mobile-open')
}

function openSidebar() {
  document.getElementById('sidebar')?.classList.add('mobile-open')
}

function hideBottomNav() {
  document.getElementById('bottom-nav')?.classList.add('hidden')
  document.getElementById('fab')?.classList.add('hidden')
  document.getElementById('main-area-el')?.classList.add('chat-mode')
}

function showBottomNav() {
  document.getElementById('bottom-nav')?.classList.remove('hidden')
  document.getElementById('fab')?.classList.remove('hidden')
  document.getElementById('main-area-el')?.classList.remove('chat-mode')
}

function closeChatMobile() {
  state.activeConvId = null
  document.getElementById('stories-bar').style.display = ''
  const chatArea = document.getElementById('chat-area')
  if (chatArea) {
    chatArea.innerHTML = `<div class="chat-bg-pattern"></div>
      <div class="empty-state">
        <div class="es-art">🌿</div>
        <h3>Welcome to Leafy</h3>
        <p>Select a conversation to start chatting</p>
      </div>`
  }
  mobilePage = 'chats'
  openSidebar()
  showBottomNav()
  switchTab('all')
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'))
  document.getElementById('nav-chats')?.classList.add('active')
}

// ─────────────────────────────────────────────
// MORE DRAWER
// ─────────────────────────────────────────────
function openMoreDrawer() {
  document.getElementById('more-drawer')?.classList.add('open')
  const backdrop = document.getElementById('drawer-backdrop')
  if (backdrop) { backdrop.style.display = 'block'; requestAnimationFrame(() => backdrop.classList.add('open')) }
  document.body.style.overflow = 'hidden'
}

function closeMoreDrawer() {
  document.getElementById('more-drawer')?.classList.remove('open')
  const backdrop = document.getElementById('drawer-backdrop')
  if (backdrop) {
    backdrop.classList.remove('open')
    setTimeout(() => { backdrop.style.display = 'none' }, 300)
  }
  document.body.style.overflow = ''
}

// ─────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(el => el.remove())
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAllModals()
    closeMoreDrawer()
    const sv = document.getElementById('story-viewer')
    if (sv && sv.style.display !== 'none') sv.style.display = 'none'
  }
})

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
const TOAST_ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }

function toast(msg, type = 'info', duration = 3200) {
  const container = document.getElementById('toast-container')
  if (!container) return
  const el = document.createElement('div')
  el.className = 'toast'
  el.innerHTML = `<span>${TOAST_ICONS[type] || 'ℹ️'}</span><span>${escHtml(msg)}</span>`
  if (type === 'error')   el.style.borderColor = 'rgba(239,68,68,.4)'
  if (type === 'success') el.style.borderColor = 'rgba(34,197,94,.35)'
  container.appendChild(el)
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translateX(20px)'
    el.style.transition = 'opacity .3s ease, transform .3s ease'
    setTimeout(() => el.remove(), 320)
  }, duration)
}

// ─────────────────────────────────────────────
// SWIPE TO REPLY (touch)
// ─────────────────────────────────────────────
function initSwipeToReply(convId) {
  const container = document.getElementById('messages-container-' + convId)
  if (!container) return

  let startX = 0, startY = 0, swipedEl = null, swiping = false

  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    swipedEl = e.target.closest('.message-row')
    swiping = false
  }, { passive: true })

  container.addEventListener('touchmove', e => {
    if (!swipedEl) return
    const dx = e.touches[0].clientX - startX
    const dy = Math.abs(e.touches[0].clientY - startY)
    if (dy > 20 && !swiping) { swipedEl = null; return }
    if (Math.abs(dx) > 10) swiping = true
    if (!swiping) return

    const isOwn = swipedEl.classList.contains('own')
    const limit = isOwn ? Math.min(-10, dx) : Math.max(10, dx)
    if ((isOwn && dx < 0) || (!isOwn && dx > 0)) {
      const clampedDx = Math.max(-60, Math.min(60, dx * 0.55))
      swipedEl.style.transform = `translateX(${clampedDx}px)`
      swipedEl.style.transition = 'none'
      const icon = swipedEl.querySelector('.swipe-reply-icon')
      if (icon) icon.style.opacity = Math.min(1, Math.abs(clampedDx) / 40)
    }
  }, { passive: true })

  container.addEventListener('touchend', e => {
    if (!swipedEl || !swiping) return
    const dx = e.changedTouches[0].clientX - startX
    swipedEl.style.transform = ''
    swipedEl.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'
    const icon = swipedEl.querySelector('.swipe-reply-icon')
    if (icon) icon.style.opacity = '0'

    if (Math.abs(dx) > 50) {
      const msgId   = swipedEl.dataset.msgId
      const isOwn   = swipedEl.classList.contains('own')
      const conv    = CONVERSATIONS.find(c => c.id === convId)
      const msg     = conv?.messages.find(m => m.id === msgId)
      if (msg) {
        const senderName = isOwn ? (myProfile?.display_name || 'You') : (CONTACTS[msg.sender]?.display_name || 'Unknown')
        setReplyTo(convId, msgId, senderName, msg.text || '')
        document.getElementById('msg-input-' + convId)?.focus()
        if (navigator.vibrate) navigator.vibrate(40)
      }
    }
    swipedEl = null; swiping = false
  })
}

// ─────────────────────────────────────────────
// TYPING INDICATOR (simulated — full impl
// would use Supabase Presence channel)
// ─────────────────────────────────────────────
let typingTimer = null

function showTyping(convId) {
  if (state.activeConvId !== convId) return
  const row = document.getElementById('typing-row')
  if (row) { row.style.opacity = '1' }
}

function hideTyping() {
  const row = document.getElementById('typing-row')
  if (row) row.style.opacity = '0'
}

// Broadcast typing via Supabase Presence (optional - attach to message input)
function handleTypingBroadcast(convId) {
  // Could use db.channel('typing:' + convId).track({ user_id: currentUser.id })
  // For now just a local debounce demo
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(hideTyping, 2000)
}

// ─────────────────────────────────────────────
// NOTIFICATION SOUND
// ─────────────────────────────────────────────
function playNotifSound() {
  if (!state.notif_sounds) return
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3)
  } catch {}
}

// ─────────────────────────────────────────────
// CHAT HEADER STATUS UPDATE
// ─────────────────────────────────────────────
function updateChatHeaderStatus(profile) {
  const statusEl = document.querySelector('.chat-status')
  if (!statusEl) return
  statusEl.textContent = profile.is_online
    ? 'Online'
    : profile.last_seen_at ? `Last seen ${formatTime(new Date(profile.last_seen_at))}` : 'Offline'
  const dot = document.querySelector('.chat-header .status-dot')
  if (dot) {
    dot.className = `status-dot ${profile.is_online ? 'online' : 'offline'}`
  }
}

// ─────────────────────────────────────────────
// SCROLL TO MESSAGE
// ─────────────────────────────────────────────
function scrollToMsg(msgId) {
  const el = document.getElementById('msg-' + msgId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.style.outline = '2px solid var(--accent)'
  el.style.outlineOffset = '4px'
  el.style.borderRadius = 'var(--radius-lg)'
  setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = '' }, 1800)
}

// ─────────────────────────────────────────────
// REPLY PREVIEW HELPERS
// ─────────────────────────────────────────────
function getReplyPreview(convId, replyToId) {
  const conv = CONVERSATIONS.find(c => c.id === convId)
  const msg  = conv?.messages.find(m => m.id === replyToId)
  if (!msg) return { name: 'Message', text: '[deleted]' }
  const isOwn = msg.sender === currentUser?.id
  return {
    name: isOwn ? (myProfile?.display_name || 'You') : (CONTACTS[msg.sender]?.display_name || 'Unknown'),
    text: msg.text?.slice(0, 80) || '[media]',
  }
}

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────
function escHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2) || '?'
}

const AVATAR_COLORS = [
  'linear-gradient(135deg,#1a7a4a,#0f4a2e)',
  'linear-gradient(135deg,#0c4a6e,#0a2e4a)',
  'linear-gradient(135deg,#7c2d12,#4a1a08)',
  'linear-gradient(135deg,#3b0764,#220040)',
  'linear-gradient(135deg,#92400e,#5a2806)',
  'linear-gradient(135deg,#164e63,#0a2e3a)',
  'linear-gradient(135deg,#4c1d95,#2a1060)',
  'linear-gradient(135deg,#881337,#540820)',
]

function getAvatarColor(id) {
  if (!id) return AVATAR_COLORS[0]
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function formatTime(date) {
  if (!date || isNaN(date)) return ''
  const now  = new Date()
  const diff = now - date
  if (diff < 60000)    return 'just now'
  if (diff < 3600000)  return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (date.getDate() === yesterday.getDate()) return 'Yesterday'
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatDate(date) {
  if (!date || isNaN(date)) return 'Today'
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
}

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024)       return bytes + ' B'
  if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function formatPreview(msg) {
  if (!msg) return ''
  const typeIcons = { poll: '📊 Poll', file: '📎 File', voice: '🎙 Voice note', image: '🖼 Image', system: '' }
  if (typeIcons[msg.type] !== undefined) return typeIcons[msg.type]
  return (msg.text || '').slice(0, 80)
}

function groupReactions(rows) {
  const map = {}
  rows.forEach(r => {
    if (!map[r.emoji]) map[r.emoji] = { emoji: r.emoji, count: 0, mine: false }
    map[r.emoji].count++
    if (r.user_id === currentUser?.id) map[r.emoji].mine = true
  })
  return Object.values(map)
}

function getFileIcon(mime) {
  if (!mime) return '📄'
  if (mime.startsWith('image/'))       return '🖼'
  if (mime.startsWith('video/'))       return '🎬'
  if (mime.startsWith('audio/'))       return '🎵'
  if (mime.includes('pdf'))            return '📕'
  if (mime.includes('zip') || mime.includes('rar') || mime.includes('7z')) return '🗜'
  if (mime.includes('sheet') || mime.includes('excel')) return '📊'
  if (mime.includes('word') || mime.includes('doc'))    return '📝'
  if (mime.includes('presentation') || mime.includes('powerpoint')) return '📋'
  return '📄'
}

function formatMsgText(text) {
  if (!text) return ''
  // Bold: **text**
  let t = escHtml(text)
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic: _text_
  t = t.replace(/_(.+?)_/g, '<em>$1</em>')
  // Code inline: `code`
  t = t.replace(/`([^`]+)`/g, `<code style="font-family:var(--font-mono);background:var(--bg-raised);padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>`)
  // Links
  t = t.replace(/(https?:\/\/[^\s<>"']+)/g, `<a href="$1" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:underline;word-break:break-all">$1</a>`)
  // Line breaks
  t = t.replace(/\n/g, '<br/>')
  return t
}

// ─────────────────────────────────────────────
// RESIZE HANDLER
// ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  const wasMobile = state.isMobile
  state.isMobile  = window.innerWidth <= 768
  if (wasMobile !== state.isMobile) {
    if (!state.isMobile) {
      // Switched to desktop: ensure sidebar visible
      document.getElementById('sidebar')?.classList.remove('mobile-open')
      showBottomNav()
    }
  }
})

// ─────────────────────────────────────────────
// HANDLE PASSWORD RESET REDIRECT
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  if (window.location.search.includes('reset=1') || window.location.hash.includes('type=recovery')) {
    // Supabase will handle the token via detectSessionInUrl: true
    // After session is set, show change password UI
    db.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        showChangePasswordModal()
      }
    })
  }
})

function showChangePasswordModal() {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.style.zIndex = '9999'
  overlay.innerHTML = `<div class="modal" onclick="event.stopPropagation()">
    <h3 style="margin-bottom:6px">🔒 Set New Password</h3>
    <p style="color:var(--text-muted);font-size:13px;margin-bottom:18px">Choose a strong new password for your account.</p>
    <div class="form-field">
      <label class="form-label">New Password</label>
      <div class="input-eye-wrap">
        <input class="form-input" id="new-pass-1" type="password" placeholder="Min. 8 characters" style="padding-right:44px"/>
        <button class="eye-btn" onclick="togglePassVis('new-pass-1',this)" tabindex="-1">👁</button>
      </div>
    </div>
    <div class="form-field">
      <label class="form-label">Confirm Password</label>
      <input class="form-input" id="new-pass-2" type="password" placeholder="Repeat password"/>
    </div>
    <div class="login-error-msg" id="change-pass-error" style="margin-bottom:10px"></div>
    <button class="login-btn" onclick="submitNewPassword()">Set Password</button>
  </div>`
  document.body.appendChild(overlay)
}

async function submitNewPassword() {
  const p1 = document.getElementById('new-pass-1')?.value
  const p2 = document.getElementById('new-pass-2')?.value
  const err = document.getElementById('change-pass-error')
  if (p1.length < 8)  { if (err) { err.textContent = 'Password must be at least 8 characters'; err.style.display = 'block' } return }
  if (p1 !== p2)      { if (err) { err.textContent = 'Passwords do not match'; err.style.display = 'block' } return }
  const { error } = await db.auth.updateUser({ password: p1 })
  if (error) { if (err) { err.textContent = error.message; err.style.display = 'block' } return }
  closeAllModals()
  toast('✅ Password updated successfully!', 'success')
  // Clean URL
  window.history.replaceState({}, document.title, '/')
}

// ─────────────────────────────────────────────
// SHOW CALLS PAGE (real data version)
// already defined above with Supabase query
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// SHOW SETTINGS PAGE (mobile version)
// ─────────────────────────────────────────────
// Full showSettingsPage() defined in the inline
// script block — calling showSettingsModal()
// opens the full settings sheet modal

// ─────────────────────────────────────────────
// RESPONSIVE: handle input keyboard on mobile
// ─────────────────────────────────────────────
if ('visualViewport' in window) {
  window.visualViewport.addEventListener('resize', () => {
    // When keyboard opens/closes on mobile
    const inputArea = document.querySelector('.input-area')
    if (inputArea && state.isMobile) {
      const vvh = window.visualViewport.height
      const bodyH = document.documentElement.clientHeight
      if (vvh < bodyH * 0.8) {
        // Keyboard is open
        inputArea.style.paddingBottom = '4px'
      } else {
        inputArea.style.paddingBottom = ''
      }
    }
  })
}

// ─────────────────────────────────────────────
// TEXTAREA AUTO-RESIZE
// ─────────────────────────────────────────────
document.addEventListener('input', e => {
  if (e.target?.classList.contains('msg-textarea')) {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }
})

// ─────────────────────────────────────────────
// PREVENT BODY SCROLL WHEN MODAL OPEN
// ─────────────────────────────────────────────
document.addEventListener('touchmove', e => {
  const overlay = document.querySelector('.modal-overlay')
  if (overlay && !overlay.contains(e.target)) e.preventDefault()
}, { passive: false })

// ─────────────────────────────────────────────
// INSTALL PROMPT (PWA Add to Home Screen)
// ─────────────────────────────────────────────
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  deferredPrompt = e
  // Show install banner after 30s if not dismissed
  setTimeout(() => {
    if (deferredPrompt && currentUser) showInstallBanner()
  }, 30000)
})

function showInstallBanner() {
  if (document.getElementById('install-banner')) return
  const banner = document.createElement('div')
  banner.id = 'install-banner'
  banner.style.cssText = `position:fixed;bottom:${state.isMobile ? 'calc(70px + env(safe-area-inset-bottom))' : '20px'};left:50%;transform:translateX(-50%);background:var(--bg-card);border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:var(--shadow-lg);z-index:8000;animation:toastIn .3s ease;max-width:340px;width:calc(100% - 32px)`
  banner.innerHTML = `<span style="font-size:22px">🌿</span>
    <div style="flex:1">
      <div style="font-weight:700;font-size:13.5px">Install Leafy</div>
      <div style="font-size:12px;color:var(--text-muted)">Add to home screen for the best experience</div>
    </div>
    <button onclick="installApp()" style="background:var(--accent);border:none;color:#fff;padding:6px 12px;border-radius:var(--radius-full);font-family:var(--font-body);font-size:12px;font-weight:700;cursor:pointer">Install</button>
    <button onclick="document.getElementById('install-banner').remove()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;padding:4px">✕</button>`
  document.body.appendChild(banner)
}

async function installApp() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  document.getElementById('install-banner')?.remove()
  if (outcome === 'accepted') toast('Leafy installed! 🌿', 'success')
}

// ─────────────────────────────────────────────
// PULL TO REFRESH (mobile)
// ─────────────────────────────────────────────
let pullStartY = 0, pulling = false

document.addEventListener('touchstart', e => {
  if (document.querySelector('.modal-overlay')) return
  const scrollable = e.target.closest('.conversations-list, .messages-container')
  if (scrollable && scrollable.scrollTop === 0) {
    pullStartY = e.touches[0].clientY
    pulling = true
  }
}, { passive: true })

document.addEventListener('touchend', async e => {
  if (!pulling) return
  const dy = e.changedTouches[0].clientY - pullStartY
  pulling = false
  if (dy > 80) {
    toast('Refreshing…', 'info', 1500)
    await loadConversations()
    await loadContacts()
    renderConversations()
    if (state.activeConvId) {
      const conv = CONVERSATIONS.find(c => c.id === state.activeConvId)
      if (conv) { conv.messages = await loadMessages(conv.id); renderMessages(conv.id) }
    }
  }
}, { passive: true })

// ─────────────────────────────────────────────
// CONNECTIVITY INDICATOR
// ─────────────────────────────────────────────
window.addEventListener('online',  () => toast('✅ Back online', 'success', 2000))
window.addEventListener('offline', () => toast('⚠️ You are offline', 'warning', 4000))
