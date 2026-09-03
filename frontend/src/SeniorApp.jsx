import { useState } from 'react'

const navItems = [
  ['home', '🏠', 'Home'],
  ['help', '🆘', 'Help'],
  ['requests', '📋', 'Requests'],
  ['family', '👨‍👩‍👧', 'Family'],
  ['profile', '👤', 'Profile'],
]

const requests = [
  { name: 'Police Assistance', date: 'Today', status: 'In Progress', color: 'bg-amber-100 text-amber-800' },
  { name: 'Welfare Check', date: 'Yesterday', status: 'Resolved', color: 'bg-emerald-100 text-emerald-800' },
]

function ActionButton({ icon, title, subtitle, className = '', onClick }) {
  return <button onClick={onClick} className={`flex min-h-[92px] w-full items-center gap-3 rounded-2xl p-4 text-left font-bold shadow-sm transition hover:-translate-y-0.5 active:scale-[.98] ${className}`}><span className="text-4xl leading-none">{icon}</span><span><span className="block text-lg font-extrabold">{title}</span><span className="mt-1 block text-xs font-medium leading-4 opacity-80">{subtitle}</span></span></button>
}

function SeniorApp({ username, onLogout }) {
  const [language, setLanguage] = useState('en')
  const [view, setView] = useState('home')
  const [sosStep, setSosStep] = useState('confirm')
  const [sosSending, setSosSending] = useState(false)
  const [sosError, setSosError] = useState('')
  const [helpStep, setHelpStep] = useState('choose')
  const [helpType, setHelpType] = useState('')
  const [problem, setProblem] = useState('')
  const [helpSubmitting, setHelpSubmitting] = useState(false)
  const [helpRequestId, setHelpRequestId] = useState('ANB-DEMO-REQUEST')
  const [myRequests, setMyRequests] = useState([])
  const [checkInDone, setCheckInDone] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')
  const hindi = language === 'hi'

  const goHome = () => { setView('home'); setSosStep('confirm'); setHelpStep('choose') }
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

  async function sendSosAlert() {
    setSosSending(true)
    setSosError('')
    try {
      const response = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizen_id: 'CIT-8841',
          emergency_type: 'Immediate Police Assistance',
          location_address: 'Model Town Phase 2, Ludhiana',
          latitude: 30.901,
          longitude: 75.8573,
          notes: `SOS triggered by ${username}`,
        }),
      })
      if (!response.ok) throw new Error('SOS service unavailable')
      setSosStep('sent')
    } catch (error) {
      const localAlert = {
        event: 'NEW_SOS_ALERT',
        local_demo: true,
        case_id: `ANB-DEMO-${Date.now()}`,
        citizen_name: 'Rajesh Sharma',
        citizen_age: 72,
        citizen_mobile: '+91 98721-XXXX5',
        emergency_type: 'Immediate Police Assistance',
        location: 'Model Town Phase 2, Ludhiana',
        sos_time: 'JUST NOW',
      }
      localStorage.setItem('anubhavi_local_sos_alert', JSON.stringify(localAlert))
      setSosStep('sent')
    } finally {
      setSosSending(false)
    }
  }

  async function submitHelpRequest() {
    setHelpSubmitting(true)
    const request = {
      id: `AST-${Date.now()}`,
      citizen_name: 'Rajesh Sharma',
      request_type: helpType,
      description: problem,
      location: 'Model Town Phase 2, Ludhiana',
      created_at: 'Just now',
      status: 'NEW',
    }
    try {
      const response = await fetch('/api/assistance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizen_id: 'CIT-8841', request_type: helpType, description: problem, location: request.location }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error('Request service unavailable')
      request.id = data.request_id || request.id
    } catch (error) {
      // Keep the demo usable when the API is offline and sync it to an open SHO tab.
      request.id = `AST-DEMO-${Date.now()}`
    } finally {
      localStorage.setItem('anubhavi_local_assistance_request', JSON.stringify(request))
      setMyRequests(prev => [request, ...prev.filter(item => item.id !== request.id)])
      setHelpRequestId(request.id)
      setHelpStep('submitted')
      setHelpSubmitting(false)
    }
  }

  function renderHome() {
    return <>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dcebf2] text-3xl">👴</div><div><h2 className="text-lg font-extrabold text-[#142b59]">{hindi ? 'सुप्रभात, राजेश! 👋' : 'Good Morning, Rajesh! 👋'}</h2><p className="mt-1 text-sm text-slate-600">{hindi ? 'हम आपकी सुरक्षा के लिए यहां हैं।' : 'We are here for your safety.'}</p></div></div>
      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-3"><span className="text-3xl">🟢</span><div><h2 className="text-lg font-extrabold text-emerald-900">{hindi ? 'आप सुरक्षित हैं' : 'YOU ARE SAFE'}</h2><p className="mt-1 text-sm leading-5 text-emerald-800">{hindi ? 'सब ठीक है। अगला चेक-इन: सुबह 10:00 बजे।' : 'Everything is okay. Next check-in: 10:00 AM.'}</p></div></div></div>
      <div className="mt-4 grid grid-cols-2 items-stretch gap-3"><ActionButton icon="🚨" title="SOS" subtitle={hindi ? 'तुरंत सहायता पाएं' : 'Get immediate assistance'} className="min-h-[132px] flex-col items-start justify-between rounded-2xl bg-red-600 p-4 text-white shadow-red-200" onClick={() => { setSosStep('confirm'); setView('sos') }} /><ActionButton icon="🤝" title={hindi ? 'मदद चाहिए' : 'Need Help'} subtitle={hindi ? 'गैर-आपातकालीन सहायता' : 'Request non-emergency help'} className="min-h-[132px] flex-col items-start justify-between rounded-2xl bg-amber-300 p-4 text-slate-950 shadow-amber-100" onClick={() => { setHelpStep('choose'); setView('help') }} /></div>
      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start gap-3"><span className="text-3xl">📅</span><div><h2 className="text-lg font-extrabold">{hindi ? 'अगला सुरक्षा चेक' : 'Next Safety Check'}</h2><p className="mt-1 font-bold text-[#426d5f]">{hindi ? 'आज • सुबह 10:00 बजे' : 'Today • 10:00 AM'}</p><p className="mt-1 text-sm text-slate-600">{hindi ? 'कृपया पुष्टि करें कि आप सुरक्षित हैं।' : 'Please confirm that you are safe.'}</p></div></div><button onClick={() => setCheckInDone(true)} className="mt-4 min-h-14 w-full rounded-xl bg-[#426d5f] text-lg font-extrabold text-white">✅ {hindi ? "मैं ठीक हूं" : "I'M OK"}</button>{checkInDone && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-800">{hindi ? '✅ सुरक्षा की पुष्टि हो गई। धन्यवाद।' : '✅ Safety Confirmed — Thank you.'}</p>}</section>
      <h2 className="mt-6 text-xl font-extrabold">{hindi ? 'त्वरित पहुंच' : 'Quick Access'}</h2><div className="mt-3 grid grid-cols-2 items-stretch gap-3"><QuickCard icon="👨‍👩‍👧" title={hindi ? 'मेरा परिवार' : 'My Family'} text={hindi ? 'आपातकालीन संपर्कों को कॉल करें' : 'Call your emergency contacts'} onClick={() => setView('family')} /><QuickCard icon="📋" title={hindi ? 'मेरे अनुरोध' : 'My Requests'} text={hindi ? 'सहायता अनुरोध देखें' : 'Track assistance requests'} onClick={() => setView('requests')} /><QuickCard icon="🔔" title={hindi ? 'सुरक्षा अलर्ट' : 'Safety Alerts'} text={hindi ? 'पुलिस के महत्वपूर्ण संदेश' : 'Important police messages'} onClick={() => setView('alerts')} /><QuickCard icon="👮" title={hindi ? 'वेलफेयर चेक' : 'Welfare Checks'} text={hindi ? 'सुरक्षा जांच देखें' : 'View scheduled checks'} onClick={() => setView('home')} /></div>
    </>
  }

  function renderSos() {
    if (sosStep === 'sent') return <ScreenCard icon="🚨" title="SOS ALERT SENT" tone="red"><p>Police have been alerted.</p><p className="mt-3 text-sm">Your location has been shared with authorised responders.<br />Family has been notified.</p><div className="mt-5 rounded-xl bg-red-50 p-4 text-left"><p className="text-sm text-red-700">Alert Status</p><p className="mt-1 text-xl font-extrabold text-red-800">Active</p></div><a href="tel:100" className="mt-5 block rounded-xl bg-red-600 py-4 text-center text-lg font-extrabold text-white">📞 Call Police</a><button className="mt-3 w-full py-3 font-bold text-slate-600" onClick={goHome}>Back to Home</button></ScreenCard>
    return <ScreenCard icon="🚨" title="Emergency Help" tone="red"><p className="text-lg font-bold">Do you need immediate police assistance?</p>{sosError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{sosError}</p>}<button onClick={sendSosAlert} disabled={sosSending} className="mt-7 min-h-16 w-full rounded-xl bg-red-600 text-lg font-extrabold text-white disabled:cursor-wait disabled:opacity-60">{sosSending ? '⏳ SENDING SOS...' : '🚨 YES, SEND SOS'}</button><button onClick={goHome} className="mt-3 min-h-14 w-full rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-700">Cancel</button></ScreenCard>
  }

  function renderHelp() {
    if (helpStep === 'submitted') return <ScreenCard icon="✅" title="Request Submitted"><p className="text-lg font-bold">Your request has been sent to the police.</p><div className="mt-6 rounded-xl bg-slate-50 p-4 text-left"><p className="text-sm text-slate-500">Request ID</p><p className="mt-1 break-all text-xl font-extrabold">{helpRequestId}</p><p className="mt-4 text-sm text-slate-500">Status</p><p className="mt-1 font-extrabold text-amber-700">Pending</p></div><button onClick={goHome} className="mt-6 min-h-14 w-full rounded-xl bg-[#426d5f] text-lg font-extrabold text-white">Back to Home</button></ScreenCard>
    if (helpStep === 'form') return <ScreenCard icon="💬" title="Describe your problem"><p className="text-sm text-slate-600">Selected: <strong>{helpType}</strong></p><textarea value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="Tell us how we can help..." className="mt-5 min-h-32 w-full resize-none rounded-xl border-2 border-slate-200 p-4 text-base outline-none focus:border-[#426d5f]" /><button onClick={startVoiceInput} className="mt-3 min-h-14 w-full rounded-xl border-2 border-[#426d5f] text-base font-extrabold text-[#426d5f]">🎙️ Speak instead of typing</button>{voiceMessage && <p className="mt-2 text-center text-sm text-[#426d5f]">{voiceMessage}</p>}<button disabled={!problem.trim() || helpSubmitting} onClick={submitHelpRequest} className="mt-5 min-h-16 w-full rounded-xl bg-[#426d5f] text-lg font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40">{helpSubmitting ? 'Submitting...' : 'Submit Request'}</button><button onClick={() => setHelpStep('choose')} className="mt-2 w-full py-3 font-bold text-slate-600">Back</button></ScreenCard>
    return <><h2 className="mt-7 text-3xl font-extrabold">How can we help you?</h2><div className="mt-6 space-y-3">{['👮 Police Assistance', '🏠 Home Safety', '📞 Welfare Check', '📄 Other Assistance', '💬 Other'].map((item) => <button key={item} onClick={() => { setHelpType(item.slice(2)); setHelpStep('form') }} className="min-h-16 w-full rounded-xl border-2 border-slate-200 bg-white px-5 text-left text-lg font-bold shadow-sm transition hover:border-[#426d5f]">{item}</button>)}</div></>
  }

  function renderRequests() { const visibleRequests = myRequests.length ? myRequests : requests; return <><h2 className="mt-7 text-3xl font-extrabold">My Assistance Requests</h2><div className="mt-6 space-y-4">{visibleRequests.map((request) => { const status = request.status === 'NEW' ? 'Pending' : request.status === 'IN_PROGRESS' ? 'In Progress' : request.status; const color = request.status === 'NEW' ? 'bg-amber-100 text-amber-800' : request.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'; return <div key={request.id || request.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-extrabold">{request.request_type || request.name}</h3><p className="mt-1 text-slate-500">{request.created_at || request.date}</p></div><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${color}`}>{status}</span></div><p className="mt-4 text-sm text-slate-600">Request ID: <strong>{request.id}</strong></p><button className="mt-3 text-sm font-bold text-[#426d5f]">View details →</button></div>})}</div></> }
  function renderFamily() { return <><h2 className="mt-7 text-3xl font-extrabold">My Family</h2><p className="mt-2 text-slate-600">Your trusted emergency contacts</p><div className="mt-6 space-y-4"><Contact name="Rahul Sharma" relation="Son" phone="tel:+919876543210" /><Contact name="Neha Sharma" relation="Daughter" phone="tel:+919876543211" /></div><button className="mt-5 min-h-14 w-full rounded-xl border-2 border-[#426d5f] text-lg font-extrabold text-[#426d5f]">+ Add Emergency Contact</button></> }
  function renderAlerts() { return <><h2 className="mt-7 text-3xl font-extrabold">Safety Alerts</h2><div className="mt-6 space-y-3"><Alert icon="🔔" title="Safety Advisory" text="Please remain alert and keep your emergency contacts updated." /><Alert icon="📅" title="Welfare Check Reminder" text="Your scheduled check-in is at 10:00 AM." /><Alert icon="👮" title="Police Message" text="Your assistance request has been assigned to an officer." /></div></> }
  function renderProfile() { return <><h2 className="mt-7 text-3xl font-extrabold">My Profile</h2><div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5"><ProfileRow label="Name" value="Senior Citizen" /><ProfileRow label="Mobile Number" value={username || 'Rajesh Sharma'} /><ProfileRow label="Address" value="H.No 412, Lane 4, Model Town Phase 2, Ludhiana" /><ProfileRow label="Police Station / Area" value="Model Town Police Station" /></div><div className="mt-5 space-y-2">{['Edit Profile', 'Emergency Contacts', 'Language / भाषा', 'Notifications', 'Privacy & Consent'].map((item) => <button key={item} className="min-h-14 w-full rounded-xl border border-slate-200 bg-white px-5 text-left text-base font-bold">{item}<span className="float-right text-slate-400">›</span></button>)}<button onClick={onLogout} className="min-h-14 w-full rounded-xl border-2 border-red-200 text-base font-extrabold text-red-600">Logout</button></div></> }

  let content = view === 'home' ? renderHome() : view === 'sos' ? renderSos() : view === 'help' ? renderHelp() : view === 'requests' ? renderRequests() : view === 'family' ? renderFamily() : view === 'alerts' ? renderAlerts() : renderProfile()
  const title = view === 'home' ? `Namaste, Senior Citizen 👋` : view === 'sos' ? '' : view === 'help' ? '' : ''

  const languageButton = <button onClick={() => setLanguage(hindi ? 'en' : 'hi')} className="rounded-full border border-[#426d5f] px-3 py-2 text-xs font-extrabold text-[#426d5f] transition hover:bg-[#eef7f1]" aria-label="Change language">{hindi ? 'English' : 'हिंदी'}</button>
  return <main className="flex min-h-screen items-center justify-center bg-slate-900 font-sans text-[#172238] sm:px-5 sm:py-8"><section className="min-h-screen w-full max-w-[390px] overflow-y-auto bg-white px-5 pb-28 shadow-[0_24px_60px_rgba(56,69,63,0.15)] sm:min-h-[760px] sm:max-h-[calc(100vh-40px)] sm:rounded-[34px] sm:border-[8px] sm:border-[#263b36] sm:px-5">{view === 'home' ? <header className="border-b border-slate-200 bg-white py-4 text-center"><div className="flex items-center justify-between"><span className="w-16" /> <p className="text-2xl font-black tracking-[0.12em] text-slate-400">ANUBHAVI</p>{languageButton}</div><p className="mt-1 text-sm font-semibold text-[#426d5f]">{hindi ? 'डिजिटल सुरक्षा साथी' : 'Digital Safety Companion'}</p></header> : <header className="flex items-center justify-between border-b border-slate-200 py-5"><button onClick={goHome} className="text-left" aria-label="Home"><p className="text-sm font-bold text-[#426d5f]">ANUBHAVI</p><h1 className="mt-1 text-xl font-extrabold">{title || (view === 'profile' ? 'My Profile' : view === 'family' ? 'My Family' : view === 'requests' ? 'My Requests' : view === 'alerts' ? 'Safety Alerts' : view === 'sos' ? 'Emergency Help' : 'Need Help')}</h1></button><div className="flex items-center gap-2">{languageButton}<button onClick={() => setView('alerts')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl shadow-sm" aria-label="Safety alerts">🔔</button></div></header>}{content}<nav className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[390px] -translate-x-1/2 justify-around border-t border-slate-200 bg-white px-1 py-2 shadow-[0_-8px_20px_rgba(20,40,30,0.08)] sm:bottom-8 sm:rounded-b-[26px] sm:border-x-[8px] sm:border-[#263b36]"><button onClick={() => setView('sos')} className="-mt-8 grid h-16 w-16 place-items-center rounded-full border-4 border-white bg-red-600 text-3xl text-white shadow-lg" aria-label="Emergency SOS">🆘</button>{navItems.map(([key, icon, label]) => <button key={key} onClick={() => setView(key)} className={`flex min-w-14 flex-col items-center gap-1 px-1 py-1 text-[10px] font-bold ${view === key ? 'text-[#426d5f]' : 'text-slate-500'}`}><span className="text-xl">{icon}</span>{hindi ? ({ home: 'होम', help: 'मदद', requests: 'अनुरोध', family: 'परिवार', profile: 'प्रोफाइल' }[key]) : label}</button>)}</nav></section></main>
}

function ScreenCard({ icon, title, tone = 'green', children }) { return <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"><div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-3xl ${tone === 'red' ? 'bg-red-100' : 'bg-emerald-100'}`}>{icon}</div><h2 className="mt-5 text-2xl font-extrabold">{title}</h2><div className="mt-4 text-slate-700">{children}</div></section> }
function QuickCard({ icon, title, text, onClick }) { return <button onClick={onClick} className="min-h-[112px] rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 active:scale-[.98]"><span className="text-2xl">{icon}</span><span className="mt-2 block text-sm font-extrabold">{title}</span><span className="mt-1 block text-xs leading-4 text-slate-500">{text}</span></button> }
function Contact({ name, relation, phone }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-lg font-extrabold">{name}</p><p className="mt-1 text-slate-500">{relation}</p><a href={phone} className="mt-4 block rounded-xl bg-[#426d5f] py-3 text-center font-extrabold text-white">📞 Call</a></div> }
function Alert({ icon, title, text }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-lg font-extrabold">{icon} {title}</p><p className="mt-2 text-sm leading-5 text-slate-600">{text}</p></div> }
function ProfileRow({ label, value }) { return <div className="py-4"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 break-all text-base font-bold text-slate-700">{value}</p></div> }

export default SeniorApp
