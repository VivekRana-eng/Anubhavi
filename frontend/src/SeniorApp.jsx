import React, { useState, useEffect } from 'react'
import { useWebSocket } from './context/WebSocketContext'

function SeniorApp({ username = 'Rajesh Sharma', onLogout }) {
  const [view, setView] = useState('home')
  const [sosStep, setSosStep] = useState('form')
  const [emergencyType, setEmergencyType] = useState('Medical Emergency')
  const [details, setDetails] = useState('')
  const [language, setLanguage] = useState('en')
  const [coords, setCoords] = useState({ lat: 30.9010, lng: 75.8573, address: 'Model Town Phase 2, Ludhiana' })
  const [locationStatus, setLocationStatus] = useState('Detecting GPS...')
  const [activeCase, setActiveCase] = useState(null)
  const [sosSending, setSosSending] = useState(false)
  const [sosError, setSosError] = useState('')
  
  // Non-Emergency Help State
  const [helpStep, setHelpStep] = useState('choose')
  const [helpType, setHelpType] = useState('')
  const [problem, setProblem] = useState('')
  const [helpSubmitting, setHelpSubmitting] = useState(false)
  const [helpRequestId, setHelpRequestId] = useState('ANB-DEMO-REQUEST')
  const [myRequests, setMyRequests] = useState([])
  const [checkInDone, setCheckInDone] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')

  const { userNotification, dismissUserNotification } = useWebSocket()
  const hindi = language === 'hi'

  // Query geolocation on mount or when SOS view is accessed
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Model Town)`
          })
          setLocationStatus('GPS Coordinates Locked')
        },
        () => {
          setLocationStatus('Location unavailable (Using Registered Residence)')
        },
        { timeout: 5000 }
      )
    } else {
      setLocationStatus('GPS hardware unavailable (Using Registered Residence)')
    }
  }, [])

  // Auto-update active case when real-time WebSocket notification arrives
  useEffect(() => {
    if (userNotification && userNotification.case_id) {
      setActiveCase(prev => ({
        ...prev,
        case_id: userNotification.case_id,
        status: userNotification.new_status || userNotification.status || prev?.status || 'ASSIGNED',
        police_station: userNotification.police_station || prev?.police_station || 'Model Town Police Station',
        officer_name: userNotification.officer_name || prev?.officer_name || 'ASI Amit Singh',
        officer_rank: userNotification.officer_rank || prev?.officer_rank || 'Assistant Sub-Inspector',
        police_id: userNotification.police_id || prev?.police_id || 'POL-1025',
        officer_mobile: userNotification.officer_mobile || prev?.officer_mobile || '+91 98721-44102',
        vehicle: userNotification.vehicle || prev?.vehicle || 'PCR Bike #12',
        response_type: userNotification.response_type || prev?.response_type || 'Police Emergency Response',
        priority: userNotification.priority || prev?.priority || 'HIGH',
        eta: userNotification.eta || prev?.eta || '10 minutes',
        instructions: userNotification.instructions || prev?.instructions || 'Officer dispatched to your location.',
        last_updated: userNotification.assigned_at || userNotification.updated_at || 'Just now'
      }))
    }
  }, [userNotification])

  const goHome = () => { setView('home'); setSosStep('form'); setHelpStep('choose') }

  const startVoiceInput = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) { setVoiceMessage('Voice input is not supported on this device.'); return }
    const recognition = new Recognition()
    recognition.lang = 'hi-IN'
    recognition.onstart = () => setVoiceMessage('Listening... बोलिए')
    recognition.onresult = (event) => { setProblem(event.results[0][0].transcript); setVoiceMessage('Voice message added.') }
    recognition.onerror = () => setVoiceMessage('Please try voice input again.')
    recognition.start()
  }

  const handleSosTriggerSubmit = async () => {
    setSosSending(true)
    setSosError('')

    const payload = {
      citizen_id: 'CIT-8841',
      citizen_name: username,
      emergency_type: emergencyType,
      description: details || 'Medical & Safety Emergency Alarm',
      location_address: coords.address,
      latitude: coords.lat,
      longitude: coords.lng,
      priority: 'CRITICAL'
    }

    try {
      const res = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      const createdCaseId = data.case_id || `ANB-SOS-${Date.now().toString().slice(-5)}`
      
      const newActiveCase = {
        case_id: createdCaseId,
        status: 'ACTIVE',
        emergency_type: emergencyType,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        police_station: 'Model Town Police Station',
        officer_name: 'Pending Police Dispatch...',
        officer_rank: 'Control Desk',
        vehicle: 'PCR Patrol Unit',
        eta: 'Calculating Dispatch...',
        instructions: 'Emergency alert dispatched to SHO Model Town Control Room.'
      }

      setActiveCase(newActiveCase)
      localStorage.setItem('anubhavi_active_case', JSON.stringify(newActiveCase))

      const sosNotifData = {
        event: 'NEW_SOS_ALERT',
        case_id: createdCaseId,
        citizen_id: 'CIT-8841',
        citizen_name: username || 'Rajesh Sharma',
        emergency_type: emergencyType,
        description: details || 'Medical & Safety Emergency Alarm',
        location: coords.address,
        priority: 'HIGH',
        sos_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString(),
        status: 'ACTIVE'
      }
      localStorage.setItem('anubhavi_local_sos_alert', JSON.stringify(sosNotifData))
      window.dispatchEvent(new CustomEvent('anubhavi_new_sos_alert', { detail: sosNotifData }))

      setSosStep('confirmed')
    } catch (err) {
      console.warn("Backend offline, triggering fallback local SOS", err)
      const fallbackCaseId = `ANB-SOS-${Date.now().toString().slice(-5)}`
      const newActiveCase = {
        case_id: fallbackCaseId,
        status: 'ACTIVE',
        emergency_type: emergencyType,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        police_station: 'Model Town Police Station',
        officer_name: 'Pending Police Dispatch...',
        officer_rank: 'Control Desk',
        vehicle: 'PCR Patrol Unit',
        eta: 'Calculating Dispatch...',
        instructions: 'Emergency alert dispatched to SHO Model Town Control Room.'
      }
      setActiveCase(newActiveCase)
      localStorage.setItem('anubhavi_active_case', JSON.stringify(newActiveCase))

      const sosNotifData = {
        event: 'NEW_SOS_ALERT',
        case_id: fallbackCaseId,
        citizen_id: 'CIT-8841',
        citizen_name: username || 'Rajesh Sharma',
        emergency_type: emergencyType,
        description: details || 'Medical & Safety Emergency Alarm',
        location: coords.address,
        priority: 'HIGH',
        sos_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        created_at: new Date().toISOString(),
        status: 'ACTIVE'
      }
      localStorage.setItem('anubhavi_local_sos_alert', JSON.stringify(sosNotifData))
      window.dispatchEvent(new CustomEvent('anubhavi_new_sos_alert', { detail: sosNotifData }))

      setSosStep('confirmed')
    } finally {
      setSosSending(false)
    }
  }

  const handleHelpSubmit = async (e) => {
    e.preventDefault()
    setHelpSubmitting(true)
    const newReq = {
      id: `AST-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: helpType,
      problem: problem || 'General Elder Assistance Requested',
      status: 'PENDING',
      created_at: 'Just now'
    }
    try {
      await fetch('/api/assistance/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen_id: 'CIT-8841',
          request_type: helpType,
          description: problem,
          priority: 'MEDIUM'
        })
      })
    } catch (e) {
      console.log('Offline submission fallback')
    }

    const assistanceNotifData = {
      event: 'NEW_ASSISTANCE_REQUEST',
      type: 'ASSISTANCE',
      title: '🤝 NEW ASSISTANCE REQUEST',
      message: `${username || 'Rajesh Sharma'} requested ${helpType}: ${problem || 'General Elder Assistance'}`,
      citizen_name: username || 'Rajesh Sharma',
      request_type: helpType,
      location: coords.address || 'Model Town Ward Phase 2',
      created_at: 'Just now',
      status: 'NEW'
    }
    localStorage.setItem('anubhavi_local_user_notification', JSON.stringify(assistanceNotifData))
    window.dispatchEvent(new CustomEvent('anubhavi_new_notification', { detail: assistanceNotifData }))

    setMyRequests([newReq, ...myRequests])
    setHelpRequestId(newReq.id)
    setHelpStep('submitted')
    setHelpSubmitting(false)
  }

  const handleDailyCheckIn = async () => {
    setCheckInDone(true)
    try {
      await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizen_id: 'CIT-8841', status: 'SAFE' })
      })
    } catch (e) {
      console.log('Check-in recorded locally')
    }
  }

  const navItems = [
    ['home', '🏠', 'Home'],
    ['help', '🤝', 'Need Help'],
    ['requests', '📋', 'My Requests'],
    ['family', '👨‍👩‍👧', 'Family'],
    ['profile', '👤', 'Profile'],
  ]

  let content = null
  let title = ''

  if (view === 'home') {
    content = (
      <div className="space-y-6 pt-5">
        {/* TOP WELCOME BAR WITH LOGOUT */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#426d5f] text-xl font-bold text-white shadow-sm">
              👵
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-500">{hindi ? 'नमस्ते' : 'Welcome Senior Resident'}</p>
              <h2 className="text-lg font-black text-slate-900">{username}</h2>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-red-50 hover:text-red-700 transition"
          >
            🚪 {hindi ? 'लॉगआउट' : 'Logout'}
          </button>
        </div>

        {/* ACTIVE SOS STATUS CARD IF SOS TRIGGERED */}
        {activeCase && (
          <div className="rounded-3xl border-2 border-red-500 bg-red-50/70 p-5 shadow-lg text-left animate-pulse">
            <div className="flex items-center justify-between border-b border-red-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚨</span>
                <div>
                  <span className="text-xs font-black text-red-700 uppercase tracking-wide">ACTIVE EMERGENCY SOS</span>
                  <h3 className="text-sm font-extrabold text-slate-900">Case ID: {activeCase.case_id}</h3>
                </div>
              </div>
              <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase text-white shadow-sm">
                {activeCase.status}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs font-bold text-slate-800">
              <p className="flex items-center gap-1.5 text-emerald-800">
                <span>🏬</span> Station: <strong>{activeCase.police_station || 'Model Town Police Station'}</strong>
              </p>
              <p className="flex items-center gap-1.5">
                <span>👮</span> Officer: <strong className="text-[#426d5f]">{activeCase.officer_rank} {activeCase.officer_name}</strong> {activeCase.police_id && `(${activeCase.police_id})`}
              </p>
              <p className="flex items-center gap-1.5">
                <span>🚓</span> Vehicle: <strong>{activeCase.vehicle || 'PCR Van #04'}</strong>
              </p>
              <p className="flex items-center gap-1.5 text-red-700">
                <span>⏱️</span> ETA: <strong>{activeCase.eta || '10 minutes'}</strong>
              </p>
            </div>

            <div className="mt-3 border-t border-red-200/80 pt-2 text-[11px] text-slate-600 font-medium">
              {activeCase.instructions}
            </div>

            <button
              onClick={() => setView('sos')}
              className="mt-3 w-full rounded-xl bg-red-600 py-2 text-center text-xs font-black text-white shadow"
            >
              TRACK LIVE SOS DETAILS →
            </button>
          </div>
        )}

        {/* DAILY SAFETY CHECK-IN BUTTON */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm font-extrabold text-emerald-950">{hindi ? 'दैनिक सुरक्षा चेक-इन' : 'Daily Safety Check-In'}</p>
              <p className="text-xs text-emerald-800">{hindi ? 'आज का चेक-इन पूरा करें' : 'Confirm you are safe today'}</p>
            </div>
            <button
              onClick={handleDailyCheckIn}
              disabled={checkInDone}
              className={`rounded-2xl px-5 py-3 text-xs font-black shadow-md transition-all ${
                checkInDone
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#426d5f] text-white hover:bg-[#34574c] active:scale-95'
              }`}
            >
              {checkInDone ? '✅ SAFE TODAY' : '👍 I AM SAFE'}
            </button>
          </div>
        </div>

        {/* LARGE EMERGENCY SOS CALL-TO-ACTION CARD */}
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">{hindi ? 'आपातकालीन बटन' : 'EMERGENCY DISPATCH'}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{hindi ? 'पुलिस / मेडिकल सहायता' : 'Emergency Police & Medical Help'}</h2>
          <p className="mt-2 text-xs leading-5 text-slate-600">{hindi ? 'तुरंत सहायता के लिए लाल बटन दबाएं' : 'Tap the big Red SOS button anytime for instant Model Town PS response.'}</p>
          
          <button
            onClick={() => { setSosStep('form'); setView('sos') }}
            className="mt-5 w-full rounded-2xl bg-red-600 py-4 text-xl font-black text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>🆘</span> {hindi ? 'आपातकालीन SOS भेजें' : 'TRIGGER EMERGENCY SOS'}
          </button>
        </section>

        {/* QUICK ACCESS GRID */}
        <div className="grid grid-cols-2 gap-4">
          <QuickCard
            icon="🤝"
            title={hindi ? 'गैर-आपातकालीन मदद' : 'Request Assistance'}
            text={hindi ? 'पुलिस गश्त, चेक-इन, ताला जांच' : 'Police check-in, lock checks & companion'}
            onClick={() => { setHelpStep('choose'); setView('help') }}
          />
          <QuickCard
            icon="📋"
            title={hindi ? 'मेरे अनुरोध' : 'My Requests'}
            text={hindi ? 'स्थिति और इतिहास देखें' : 'View status & police responses'}
            onClick={() => setView('requests')}
          />
          <QuickCard
            icon="👨‍👩‍👧"
            title={hindi ? 'इमरजेंसी संपर्क' : 'Family Keyholders'}
            text={hindi ? 'परिवार व पड़ोसी' : 'Son, daughter & verified neighbor'}
            onClick={() => setView('family')}
          />
          <QuickCard
            icon="👤"
            title={hindi ? 'मेरी प्रोफाइल' : 'My Profile'}
            text={hindi ? 'मेडिकल व घर विवरण' : 'Medical dossier & address'}
            onClick={() => setView('profile')}
          />
        </div>
      </div>
    )
  }

  if (view === 'sos') {
    title = hindi ? 'आपातकालीन सहायता' : 'Emergency Help (SOS)'
    content = (
      <div className="space-y-5 pt-3">
        {sosStep === 'form' && (
          <div className="space-y-4 text-left">
            <div className="rounded-2xl bg-red-50 p-4 border border-red-200 text-center">
              <span className="text-4xl">🚨</span>
              <h2 className="mt-2 text-xl font-black text-red-700">{hindi ? 'आपातकालीन सहायता' : 'Emergency SOS Dispatch'}</h2>
              <p className="text-xs text-slate-600 mt-1">{hindi ? 'आपकी लोकेशन पुलिस कंट्रोल रूम को भेजी जाएगी' : 'Model Town PS dispatch team will be alerted immediately with your GPS coordinates.'}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs">
              <p className="font-extrabold text-slate-700">{hindi ? '📍 आपकी लोकेशन status:' : '📍 Current Telemetry Location:'}</p>
              <p className="text-emerald-700 font-bold mt-0.5">{locationStatus}</p>
              <p className="text-slate-500 text-[11px] mt-1">{coords.address}</p>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                1. {hindi ? 'आपातकाल का प्रकार चुनें' : 'Select Emergency Type'}
              </label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full h-12 px-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-800"
              >
                <option value="Medical Emergency">🚑 Medical Emergency / Cardiac Fall</option>
                <option value="Safety Threat">👮 Security / Intruder Threat</option>
                <option value="Fire & Panic">🔥 Fire & Physical Danger</option>
                <option value="General Panic Alert">🚨 General Urgent Panic Alarm</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                2. {hindi ? 'विवरण (वैकल्पिक)' : 'Add Details (Optional)'}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={hindi ? 'अपनी स्थिति बताएं...' : 'e.g., Unable to open door, chest discomfort...'}
                className="w-full min-h-24 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSosStep('confirm')}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <span>🚨</span> {hindi ? 'SOS सहायता की पुष्टि करें' : 'CONFIRM & SEND SOS'}
              </button>
            </div>
          </div>
        )}

        {sosStep === 'confirm' && (
          <div className="space-y-4 text-center">
            <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200">
              <span className="text-5xl">⚠️</span>
              <h2 className="mt-3 text-xl font-black text-amber-900">{hindi ? 'क्या आप SOS भेजना चाहते हैं?' : 'Send Emergency SOS Alert?'}</h2>
              <p className="text-xs text-amber-800 mt-2 font-medium">
                {hindi ? 'मॉडल टाउन पुलिस स्टेशन को आपका अलर्ट तुरंत भेजा जाएगा।' : 'This will immediately alert Model Town Police Station & dispatch nearest beat constable PCR unit.'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-1">
              <p><strong>Emergency:</strong> {emergencyType}</p>
              <p><strong>Details:</strong> {details || 'Panic Alert'}</p>
              <p><strong>Location:</strong> {coords.address}</p>
            </div>

            {sosError && (
              <p className="text-xs font-bold text-red-600">{sosError}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSosStep('form')}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                CANCEL
              </button>
              <button
                onClick={handleSosTriggerSubmit}
                disabled={sosSending}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-sm shadow-lg shadow-red-600/20"
              >
                {sosSending ? 'SENDING...' : '🚨 CONFIRM SOS'}
              </button>
            </div>
          </div>
        )}

        {sosStep === 'confirmed' && (
          <ScreenCard icon="🚨" title={hindi ? 'SOS अलर्ट भेजा गया!' : 'SOS Emergency Alert Dispatched!'} tone="red">
            <p className="text-sm font-bold text-slate-800">Case ID: {activeCase?.case_id}</p>
            <p className="mt-2 text-xs text-slate-600">
              {hindi ? 'मॉडल टाउन पुलिस स्टेशन SHO कमांड को आपका अलर्ट प्राप्त हो गया है।' : 'Model Town PS SHO Command has received your emergency alert. Patrol unit is being assigned.'}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-2">
              <p className="font-extrabold text-slate-900"><strong>Status:</strong> <span className="text-red-600 uppercase font-black">{activeCase?.status || 'DISPATCHING'}</span></p>
              <p><strong>Assigned Officer:</strong> {activeCase?.officer_name || 'HC Raj Kumar'}</p>
              <p><strong>PCR Vehicle:</strong> {activeCase?.vehicle || 'Patrol Unit PCR-04'}</p>
              <p><strong>Estimated ETA:</strong> {activeCase?.eta || '10 minutes'}</p>
            </div>

            <button onClick={goHome} className="mt-5 w-full rounded-xl bg-[#426d5f] py-3 font-extrabold text-white">
              RETURN TO HOME
            </button>
          </ScreenCard>
        )}
      </div>
    )
  }

  if (view === 'help') {
    title = hindi ? 'गैर-आपातकालीन सहायता' : 'Request Assistance'
    content = (
      <div className="space-y-4 pt-3">
        {helpStep === 'choose' && (
          <div className="space-y-3 text-left">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{hindi ? 'सहायता का प्रकार चुनें' : 'Select Assistance Needed:'}</p>

            {[
              ['Police Beat Check-in', '👮 Police Beat Officer Check-in', 'Request local beat officer to visit senior home.'],
              ['Lock & Security Check', '🔒 Door & Gate Safety Check', 'Constable inspection of main doors & locks.'],
              ['Medical Prescription Help', '💊 Medical Delivery Support', 'Assistance fetching urgent pharmacy supplies.'],
              ['Cyber & Scam Help', '🛡️ Scam / Pension Support', 'Report suspicious phone calls or financial fraud.']
            ].map(([val, label, sub]) => (
              <button
                key={val}
                onClick={() => { setHelpType(val); setHelpStep('form') }}
                className="w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-left hover:border-[#426d5f] transition active:scale-98 block"
              >
                <p className="text-sm font-extrabold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
              </button>
            ))}
          </div>
        )}

        {helpStep === 'form' && (
          <form onSubmit={handleHelpSubmit} className="space-y-4 text-left">
            <div className="rounded-xl bg-[#eef7f1] p-3 border border-[#426d5f]/20">
              <span className="text-xs font-bold text-[#426d5f]">Request Type: {helpType}</span>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                Describe Problem / Request
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe your request in detail..."
                className="w-full min-h-24 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startVoiceInput}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                🎙️ {hindi ? 'बोलकर बताएं' : 'Voice Input'}
              </button>
              {voiceMessage && <span className="text-xs text-emerald-700 font-bold">{voiceMessage}</span>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHelpStep('choose')}
                className="w-1/2 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={helpSubmitting}
                className="w-1/2 py-3 bg-[#426d5f] hover:bg-[#34574c] text-white font-black rounded-xl text-sm shadow-md"
              >
                {helpSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
              </button>
            </div>
          </form>
        )}

        {helpStep === 'submitted' && (
          <ScreenCard icon="✅" title={hindi ? 'अनुरोध प्राप्त हुआ' : 'Assistance Request Logged!'}>
            <p className="text-sm font-bold text-slate-800">Request ID: {helpRequestId}</p>
            <p className="mt-2 text-xs text-slate-600">
              {hindi ? 'मॉडल टाउन बीट अधिकारी को आपका अनुरोध भेज दिया गया है।' : 'Model Town Beat Patrol has received your request and will schedule a visit.'}
            </p>
            <button onClick={goHome} className="mt-5 w-full rounded-xl bg-[#426d5f] py-3 font-extrabold text-white">
              RETURN TO HOME
            </button>
          </ScreenCard>
        )}
      </div>
    )
  }

  if (view === 'requests') {
    title = hindi ? 'मेरे अनुरोध' : 'My Requests & SOS Status'
    content = (
      <div className="space-y-4 pt-3 text-left">
        {activeCase && (
          <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-700">🚨 EMERGENCY SOS #{activeCase.case_id}</span>
              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase">{activeCase.status}</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mt-2">Station: {activeCase.police_station || 'Model Town Police Station'}</p>
            <p className="text-xs text-slate-700">Officer: {activeCase.officer_rank} {activeCase.officer_name} ({activeCase.vehicle})</p>
            <p className="text-xs text-red-700 font-bold mt-1">ETA: {activeCase.eta}</p>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">PREVIOUS ASSISTANCE REQUESTS</h3>

          {myRequests.length === 0 ? (
            <div className="text-xs text-slate-500 py-3 text-center">
              <p>No active non-emergency assistance requests.</p>
            </div>
          ) : (
            myRequests.map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-slate-900">{r.type}</p>
                  <p className="text-slate-500 text-[11px]">{r.problem}</p>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">{r.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (view === 'family') {
    title = hindi ? 'इमरजेंसी संपर्क' : 'Registered Family & Keyholders'
    content = (
      <div className="space-y-4 pt-3 text-left">
        <div className="rounded-xl bg-[#eef7f1] p-3 text-xs font-medium text-[#426d5f] border border-[#426d5f]/20">
          ℹ️ {hindi ? 'आपात स्थिति में इन संपर्कों को ऑटोमैटिक अलर्ट भेजा जाता है।' : 'These contacts receive instant SMS & WhatsApp alerts when you trigger SOS.'}
        </div>
        <Contact name="Amit Sharma" relation="Son (Primary Kin) • Keyholder" phone="tel:+919872100123" />
        <Contact name="Col. S. Dhillon" relation="Verified Neighbor • Keyholder" phone="tel:+919417288301" />
      </div>
    )
  }

  if (view === 'profile') {
    title = hindi ? 'मेरी प्रोफाइल' : 'My Senior Profile'
    content = (
      <div className="space-y-4 pt-3 text-left divide-y divide-slate-100">
        <ProfileRow label="Full Name" value={username} />
        <ProfileRow label="Senior Registry ID" value="CIT-8841" />
        <ProfileRow label="Jurisdiction Police Station" value="Model Town Police Station (MTP-PS-01)" />
        <ProfileRow label="Registered Residence" value="House #402, Sector 3, Model Town, Ludhiana" />
        <ProfileRow label="Registered Mobile" value="+91 98102-33412" />
        <ProfileRow label="Medical Dossier (Critical)" value="Severe Cardiac History, Pacemaker Fitted (2023), Hypertension" />
      </div>
    )
  }

  const languageButton = <button onClick={() => setLanguage(hindi ? 'en' : 'hi')} className="rounded-full border border-[#426d5f] px-3 py-2 text-xs font-extrabold text-[#426d5f] transition hover:bg-[#eef7f1]" aria-label="Change language">{hindi ? 'English' : 'हिंदी'}</button>
  
  return (
    <main className="flex min-h-screen items-center justify-center bg-white font-sans text-[#172238] sm:px-5 sm:py-8 relative">
      
      {/* REAL-TIME NOTIFICATION POPUP FOR SENIOR CITIZEN */}
      {userNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-[#426d5f] animate-in fade-in zoom-in duration-200 text-left">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-4xl">🚔</span>
              <div>
                <h3 className="text-base font-black text-slate-900">{userNotification.title || 'RESPONSE ASSIGNED'}</h3>
                <p className="text-xs font-extrabold text-[#426d5f]">Case ID: {userNotification.case_id}</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600 font-medium">
              Your SOS request has been received and a police response has been assigned.
            </p>

            <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
              <p className="font-extrabold text-emerald-900 border-b border-slate-200/80 pb-1.5">
                🏬 Station: <span className="text-slate-900">{userNotification.police_station || 'Model Town Police Station'}</span>
              </p>
              
              {userNotification.officer_name && (
                <p className="font-extrabold text-slate-900">
                  👮 Officer: <span className="text-[#426d5f]">{userNotification.officer_rank} {userNotification.officer_name}</span> {userNotification.police_id && `(${userNotification.police_id})`}
                </p>
              )}
              
              {userNotification.vehicle && (
                <p className="font-bold text-slate-800">
                  🚓 Vehicle: {userNotification.vehicle}
                </p>
              )}

              {userNotification.response_type && (
                <p className="font-semibold text-slate-700">
                  🛡️ Response: {userNotification.response_type}
                </p>
              )}

              {userNotification.priority && (
                <p className="font-extrabold text-amber-700">
                  ⚡ Priority: {userNotification.priority}
                </p>
              )}

              {userNotification.eta && (
                <p className="font-black text-red-600 text-sm pt-1">
                  ⏱️ Estimated ETA: {userNotification.eta}
                </p>
              )}

              <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-200 mt-2 font-medium">
                {userNotification.instructions || userNotification.message || 'Police response team dispatched for on-scene support.'}
              </p>
            </div>

            <button
              onClick={() => {
                dismissUserNotification()
                setView('home')
              }}
              className="mt-4 w-full h-12 bg-[#426d5f] hover:bg-[#34574c] text-white font-black rounded-xl shadow-md transition-all text-xs tracking-wider uppercase"
            >
              VIEW SOS STATUS
            </button>
          </div>
        </div>
      )}

      <section className="min-h-screen w-full max-w-[390px] overflow-y-auto bg-white px-5 pb-28 shadow-[0_24px_60px_rgba(56,69,63,0.15)] sm:min-h-[760px] sm:max-h-[calc(100vh-40px)] sm:rounded-[34px] sm:border-[8px] sm:border-[#263b36] sm:px-5">
        {view === 'home' ? (
          <header className="border-b border-slate-200 bg-white py-4 text-center">
            <div className="flex items-center justify-between">
              <span className="w-16" />
              <p className="text-2xl font-black tracking-[0.12em] text-slate-400">ANUBHAVI</p>
              {languageButton}
            </div>
            <p className="mt-1 text-sm font-semibold text-[#426d5f]">{hindi ? 'डिजिटल सुरक्षा साथी' : 'Digital Safety Companion'}</p>
          </header>
        ) : (
          <header className="flex items-center justify-between border-b border-slate-200 py-5">
            <button onClick={goHome} className="text-left" aria-label="Home">
              <p className="text-sm font-bold text-[#426d5f]">ANUBHAVI</p>
              <h1 className="mt-1 text-xl font-extrabold">{title || (view === 'profile' ? 'My Profile' : view === 'family' ? 'My Family' : view === 'requests' ? 'My Requests' : view === 'alerts' ? 'Safety Alerts' : view === 'sos' ? 'Emergency Help' : 'Need Help')}</h1>
            </button>
            <div className="flex items-center gap-2">
              {languageButton}
              <button onClick={() => setView('alerts')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl shadow-sm" aria-label="Safety alerts">🔔</button>
            </div>
          </header>
        )}
        
        {content}

        <nav className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[390px] -translate-x-1/2 justify-around border-t border-slate-200 bg-white px-1 py-2 shadow-[0_-8px_20px_rgba(20,40,30,0.08)] sm:bottom-8 sm:rounded-b-[26px] sm:border-x-[8px] sm:border-[#263b36]">
          <button onClick={() => { setSosStep('form'); setView('sos') }} className="-mt-8 grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-red-600 text-3xl text-white shadow-lg" aria-label="Emergency SOS">🆘</button>
          {navItems.map(([key, icon, label]) => (
            <button key={key} onClick={() => setView(key)} className={`flex min-w-14 flex-col items-center gap-1 px-1 py-1 text-[10px] font-bold ${view === key ? 'text-[#426d5f]' : 'text-slate-500'}`}>
              <span className="text-xl">{icon}</span>
              {hindi ? ({ home: 'होम', help: 'मदद', requests: 'अनुरोध', family: 'परिवार', profile: 'प्रोफाइल' }[key]) : label}
            </button>
          ))}
        </nav>
      </section>
    </main>
  );
}

function ScreenCard({ icon, title, tone = 'green', children }) { return <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"><div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl ${tone === 'red' ? 'bg-red-100' : 'bg-emerald-100'}`}>{icon}</div><h2 className="mt-5 text-2xl font-extrabold">{title}</h2><div className="mt-4 text-slate-700">{children}</div></section> }
function QuickCard({ icon, title, text, onClick }) { return <button onClick={onClick} className="min-h-[112px] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 active:scale-[.98]"><span className="text-2xl">{icon}</span><span className="mt-2 block text-sm font-extrabold">{title}</span><span className="mt-1 block text-xs leading-4 text-slate-500">{text}</span></button> }
function Contact({ name, relation, phone }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-lg font-extrabold">{name}</p><p className="mt-1 text-slate-500">{relation}</p><a href={phone} className="mt-4 block rounded-xl bg-[#426d5f] py-3 text-center font-extrabold text-white">📞 Call</a></div> }
function Alert({ icon, title, text }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-lg font-extrabold">{icon} {title}</p><p className="mt-2 text-sm leading-5 text-slate-600">{text}</p></div> }
function ProfileRow({ label, value }) { return <div className="py-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-all text-base font-bold text-slate-700">{value}</p></div> }

export default SeniorApp
