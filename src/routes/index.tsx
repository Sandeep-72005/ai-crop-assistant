import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CloudSun,
  Droplets,
  FileText,
  ImagePlus,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  ScanLine,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Wand2,
  X,
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { diseases } from '@/lib/diseases'
import { Marquee } from '@/components/ui/marquee'

export const Route = createFileRoute('/')({ component: Home })

type Message = { role: 'user' | 'assistant'; text: string }
type Language = 'en' | 'kn'

function Home() {
  const [page, setPage] = useState('Overview')
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const [chat, setChat] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const [question, setQuestion] = useState('')
  const [chatBusy, setChatBusy] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello, grower. Tell me what’s happening in your field or garden. What crop are you growing, and what have you noticed?',
    },
  ])

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const filtered = diseases.filter((d) => `${d.name} ${d.crop}`.toLowerCase().includes(query.toLowerCase()))

  const suggestionList =
    language === 'kn'
      ? [
          'ಟಮೇಟೋದಲ್ಲಿ ಆರಂಭಿಕ ಬ್ಲೈಟ್ ಅನ್ನು ಹೇಗೆ ಗುರುತಿಸುವುದು?',
          'ನನ್ನ ಜೋಳದ ಬೆಳೆಗೆ ಈ ವಾರ ನೀರು ಹೇಗೆ ಒದಗಿಸಬೇಕು?',
          'ಮಡಚಿದ/onಮೆತ್ತದ ಪೋಷಣೆಗಾಗಿ ನಾನು ಏನು ಗಮನಿಸಬೇಕು?',
        ]
      : [
          'How do I identify early blight on tomato leaves?',
          'When should I irrigate my maize crop this week?',
          'What should I watch for in a rice field with yellow patches?',
        ]

  useEffect(() => {
    if (!isAnalyzing) return

    const interval = window.setInterval(() => {
      setAnalysisProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return Math.min(current + 14, 100)
      })
    }, 240)

    return () => window.clearInterval(interval)
  }, [isAnalyzing])

  function navigate(next: string) {
    setMenu(false)
    if (next === 'AI Assistant') {
      setPage('AI Assistant')
      setChat(true)
      return
    }
    setPage(next)
  }

  function handleImageSelection(file?: File | null) {
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(String(reader.result ?? ''))
    }
    reader.readAsDataURL(file)
  }

  async function send(text = question) {
    if (!text.trim() || chatBusy) return

    const nextMessages = [...messages, { role: 'user', text: text.trim() }]
    setMessages(nextMessages)
    setQuestion('')
    setChatBusy(true)

    try {
      const response = await fetch('/api/crop-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', messages: nextMessages }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send.')

      setMessages([...nextMessages, { role: 'assistant', text: data.reply }])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send. Try again.'
      setMessages([...nextMessages, { role: 'assistant', text: message }])
    } finally {
      setChatBusy(false)
    }
  }

  function resetAnalysis() {
    setIsAnalyzing(false)
    setAnalysisProgress(0)
    setUploadedImage(null)
  }

  return (
    <div className={`app-shell ${language === 'kn' ? 'kannada' : ''}`}>
      <aside className={`sidebar ${menu ? 'is-open' : ''}`}>
        <a href="/" className="brand" aria-label="Cropwise home">
          <span className="brand-mark">
            <Sprout size={25} />
          </span>
          cropwise<span className="brand-dot">.</span>
        </a>

        <div className="workspace-label">YOUR GROWING COMPANION</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {['Overview', 'Disease Detector', 'Disease Library', 'AI Assistant'].map((name) => (
            <button
              key={name}
              className={page === name || (name === 'AI Assistant' && chat) ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(name)}
              type="button"
            >
              <span className="nav-icon">
                {name === 'Overview' ? <Sun size={18} /> : name === 'Disease Detector' ? <ScanLine size={18} /> : name === 'Disease Library' ? <BookOpen size={18} /> : <MessageCircle size={18} />}
              </span>
              {name}
              {name === 'AI Assistant' && <span className="new-label">AI</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="grow-card">
            <span className="grow-icon">
              <Leaf size={18} />
            </span>
            <h3>A little care.</h3>
            <p>Your crops have a story. Let’s help them thrive.</p>
            <span className="mini-leaf">
              <Sprout size={18} strokeWidth={1.2} />
            </span>
          </div>

          <button className="nav-item help-item" onClick={() => navigate('AI Assistant')} type="button">
            <span className="nav-icon">
              <CircleHelp size={18} />
            </span>
            Help & getting started
            <ArrowRight size={15} />
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb" aria-label="Current page">
            <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenu(!menu)} type="button">
              <Menu size={18} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <span className="live-dot" aria-hidden="true" />
            Your crop health companion
            <button aria-label="Open crop health assistant" onClick={() => navigate('AI Assistant')} type="button">
              <Sparkles size={18} />
            </button>
            <span className="avatar small">G</span>
          </div>
        </header>

        <main className="page-main">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <Sun size={15} />
                <span>GOOD THINGS START WITH HEALTHY CROPS</span>
              </div>
              <h1>
                {page === 'Disease Library' && 'A little knowledge. A healthier field.'}
                {page === 'Disease Detector' && 'Let’s take a closer look.'}
                {page === 'AI Assistant' && 'A growing companion, ready to help.'}
                {page === 'Overview' && 'Healthy fields, thoughtful decisions.'}
              </h1>
              <p>
                {page === 'Disease Library' && 'Explore common symptoms, treatment options, and ways to prevent disease.'}
                {page === 'Disease Detector' && 'Spot the signs early. Understand the problem. Grow with confidence.'}
                {page === 'AI Assistant' && 'Ask about crop stress, nutrient issues, timing, and field care recommendations.'}
                {page === 'Overview' && 'Track field health, keep plans on schedule, and respond quickly when crops need attention.'}
              </p>
            </div>
            <span className="nature-tag">
              <span className="nature-dot" />
              Rooted in better growing
            </span>
          </div>

          {page === 'Overview' && (
            <>
              <Marquee items={['Leaf health', 'Soil care', 'AI scouting', 'Better yields', 'Field notes', 'Healthy roots']} />

              <section className="dashboard-hero panel">
                <div className="hero-copy">
                  <p className="welcome-line">Good morning, Gopal</p>
                  <h2>Everything looks calmer today.</h2>
                  <p>
                    This week is a strong window for crop checks. Keep an eye on moisture, leaf color, and any unusual spots before they spread.
                  </p>
                  <div className="hero-actions">
                    <button type="button" className="primary-button" onClick={() => navigate('AI Assistant')}>
                      <Sparkles size={17} /> Ask AI assistant
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setPage('Disease Detector')}>
                      <ScanLine size={17} /> Scan crop
                    </button>
                  </div>
                </div>

                <div className="weather-card">
                  <div className="weather-header">
                    <div className="weather-label">
                      <CloudSun size={18} />
                      Weather overview
                    </div>
                    <span className="chip chip-soft">Today</span>
                  </div>
                  <div className="weather-temp-row">
                    <strong>31°C</strong>
                    <span>Sunny intervals</span>
                  </div>
                  <div className="weather-meta">
                    <span>
                      <Droplets size={15} /> 48% humidity
                    </span>
                    <span>
                      <MapPin size={15} /> Coimbatore
                    </span>
                  </div>
                </div>
              </section>

              <div className="metrics-row">
                <div className="metric-card panel">
                  <div className="metric-topline">
                    <span className="icon-badge green">
                      <Leaf size={16} />
                    </span>
                    <span className="metric-label">Crop health</span>
                  </div>
                  <strong>82%</strong>
                  <small>Stable with minor stress</small>
                </div>
                <div className="metric-card panel">
                  <div className="metric-topline">
                    <span className="icon-badge gold">
                      <Droplets size={16} />
                    </span>
                    <span className="metric-label">Soil moisture</span>
                  </div>
                  <strong>62%</strong>
                  <small>Good moisture balance</small>
                </div>
                <div className="metric-card panel">
                  <div className="metric-topline">
                    <span className="icon-badge cyan">
                      <ShieldCheck size={16} />
                    </span>
                    <span className="metric-label">Pest risk</span>
                  </div>
                  <strong>Low</strong>
                  <small>No major alerts</small>
                </div>
              </div>

              <div className="dashboard-grid">
                <section className="panel surface-panel">
                  <div className="section-heading-row">
                    <div>
                      <span className="section-kicker">MY CROPS</span>
                      <h3>Active fields</h3>
                    </div>
                    <button type="button" className="text-button small-text" onClick={() => setPage('Disease Library')}>
                      View all <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="crop-list">
                    <div className="crop-row">
                      <div className="crop-identity">
                        <span className="crop-badge tomato">T</span>
                        <div>
                          <strong>Tomato</strong>
                          <small>Block 3 · 1.4 acres</small>
                        </div>
                      </div>
                      <span className="status-pill success">Healthy</span>
                    </div>
                    <div className="crop-row">
                      <div className="crop-identity">
                        <span className="crop-badge rice">R</span>
                        <div>
                          <strong>Rice</strong>
                          <small>North plot · 2.1 acres</small>
                        </div>
                      </div>
                      <span className="status-pill warning">Check</span>
                    </div>
                    <div className="crop-row">
                      <div className="crop-identity">
                        <span className="crop-badge maize">M</span>
                        <div>
                          <strong>Maize</strong>
                          <small>South ridge · 1.8 acres</small>
                        </div>
                      </div>
                      <span className="status-pill neutral">Stable</span>
                    </div>
                  </div>
                </section>

                <section className="panel surface-panel">
                  <div className="section-heading-row">
                    <div>
                      <span className="section-kicker">FARMING CALENDAR</span>
                      <h3>Reminders</h3>
                    </div>
                    <CalendarDays size={16} className="muted-icon" />
                  </div>

                  <div className="reminder-stack">
                    <div className="reminder-item">
                      <span className="reminder-date">Tue</span>
                      <div>
                        <strong>Fertilizer review</strong>
                        <small>Tomato field · 9:30 AM</small>
                      </div>
                    </div>
                    <div className="reminder-item">
                      <span className="reminder-date accent">Thu</span>
                      <div>
                        <strong>Watering check</strong>
                        <small>Rice plot · 6:00 AM</small>
                      </div>
                    </div>
                    <div className="reminder-item">
                      <span className="reminder-date">Sat</span>
                      <div>
                        <strong>Field scouting</strong>
                        <small>All plots · 7:15 AM</small>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bottom-grid">
                <section className="panel surface-panel">
                  <div className="section-heading-row">
                    <div>
                      <span className="section-kicker">QUICK ACTIONS</span>
                      <h3>Start a task</h3>
                    </div>
                  </div>

                  <div className="quick-grid">
                    <button type="button" className="quick-action" onClick={() => setPage('Disease Detector')}>
                      <ScanLine size={18} />
                      Diagnose crop
                    </button>
                    <button type="button" className="quick-action" onClick={() => setPage('Disease Library')}>
                      <BookOpen size={18} />
                      Explore guides
                    </button>
                    <button type="button" className="quick-action" onClick={() => navigate('AI Assistant')}>
                      <MessageCircle size={18} />
                      Ask assistant
                    </button>
                    <button type="button" className="quick-action" onClick={() => setPage('Overview')}>
                      <Sun size={18} />
                      Check weather
                    </button>
                  </div>
                </section>

                <section className="panel surface-panel tip-panel">
                  <div className="section-heading-row">
                    <div>
                      <span className="section-kicker">DAILY FARMING TIP</span>
                      <h3>Small actions, big outcomes</h3>
                    </div>
                    <span className="tip-icon">
                      <Leaf size={18} />
                    </span>
                  </div>

                  <p>
                    Check the undersides of leaves during early morning scouting. Many fungal issues and pest signs show up there before larger damage becomes visible.
                  </p>
                </section>

                <section className="panel surface-panel">
                  <div className="section-heading-row">
                    <div>
                      <span className="section-kicker">RECENT AI CONSULTS</span>
                      <h3>Latest advice</h3>
                    </div>
                  </div>

                  <div className="consult-list">
                    <div className="consult-item">
                      <span className="consult-pill">Tomato</span>
                      <p>Leaf spots have been increasing after heavy rain.</p>
                    </div>
                    <div className="consult-item">
                      <span className="consult-pill">Rice</span>
                      <p>Water management advice updated after field review.</p>
                    </div>
                    <div className="consult-item">
                      <span className="consult-pill">Maize</span>
                      <p>Nutrition checks recommended before the next irrigated cycle.</p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {page === 'AI Assistant' && (
            <section className="assistant-stage panel">
              <div className="assistant-header-row">
                <div>
                  <span className="section-kicker">AI assistant</span>
                  <h3>Crop guidance</h3>
                </div>
                <div className="language-switch" aria-label="Language switch">
                  <button type="button" className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>
                    EN
                  </button>
                  <button type="button" className={language === 'kn' ? 'active' : ''} onClick={() => setLanguage('kn')}>
                    ಕ
                  </button>
                </div>
              </div>

              <div className="suggestion-row">
                {suggestionList.map((item) => (
                  <button type="button" key={item} className="suggestion-chip" onClick={() => setQuestion(item)}>
                    {item}
                  </button>
                ))}
              </div>

              <div className="chat-window" aria-live="polite">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`message-bubble ${message.role === 'assistant' ? 'assistant' : 'user'}`}>
                    {message.text}
                  </div>
                ))}

                {chatBusy && (
                  <div className="message-bubble assistant typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                )}
              </div>

              <form
                className="chat-composer"
                onSubmit={(event) => {
                  event.preventDefault()
                  void send()
                }}
              >
                <button type="button" className="composer-icon-button" aria-label="Add image" onClick={() => fileInputRef.current?.click()}>
                  <ImagePlus size={17} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(event) => handleImageSelection(event.target.files?.[0])} />

                <textarea
                  aria-label="Ask a crop question"
                  rows={1}
                  placeholder={language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ…' : 'Ask about your crops, field conditions, or crop care…'}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />

                <button type="button" className="composer-icon-button mic-button" aria-label="Voice input"
                  onClick={() => setQuestion((current) => current || 'Can you help me review crop stress in my field?')}>
                  <Mic size={17} />
                </button>

                <button type="submit" className="send-button" disabled={chatBusy || !question.trim()} aria-label="Send message">
                  <Send size={17} />
                </button>
              </form>
            </section>
          )}

          {page === 'Disease Detector' && (
            <section className="detector-layout">
              <div className="panel upload-panel">
                <div className="section-heading-row">
                  <div>
                    <span className="section-kicker">CROP DOCTOR</span>
                    <h3>Upload a crop image</h3>
                  </div>
                  <span className="step-label">001 / upload</span>
                </div>

                <div
                  className={`upload-box ${uploadedImage ? 'has-preview' : ''}`}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()
                    handleImageSelection(event.dataTransfer.files?.[0])
                  }}
                  onClick={() => cameraInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      cameraInputRef.current?.click()
                    }
                  }}
                >
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={(event) => handleImageSelection(event.target.files?.[0])} />
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Selected crop preview" className="upload-preview" />
                  ) : (
                    <>
                      <div className="upload-icon"><ImagePlus size={28} /></div>
                      <h4>Drop your crop photo here</h4>
                      <p>or browse files to upload</p>
                    </>
                  )}
                </div>

                <div className="detector-actions">
                  <button type="button" className="secondary-button" onClick={() => cameraInputRef.current?.click()}>
                    <Camera size={17} /> Mobile camera / gallery
                  </button>
                  <button type="button" className="primary-button" onClick={() => setIsAnalyzing(true)} disabled={isAnalyzing || !uploadedImage}>
                    <ScanLine size={17} /> {isAnalyzing ? 'Analyzing…' : 'Analyze crop'}
                  </button>
                </div>
              </div>

              <div className="panel report-panel">
                <div className="section-heading-row">
                  <div>
                    <span className="section-kicker">DIAGNOSIS REPORT</span>
                    <h3>Field assessment</h3>
                  </div>
                  <span className="chip chip-soft">{analysisProgress >= 100 ? 'Ready' : 'In progress'}</span>
                </div>

                <div className="progress-wrap">
                  <div className="progress-head">
                    <span>Analysis progress</span>
                    <strong>{analysisProgress}%</strong>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${analysisProgress}%` }} />
                  </div>
                </div>

                <div className="report-grid">
                  <div className="report-card emphasized">
                    <p>Possible concern</p>
                    <strong>Early blight</strong>
                    <small>Possible fungal stress on older leaves.</small>
                  </div>

                  <div className="report-card">
                    <p>Likely crop</p>
                    <strong>Tomato</strong>
                    <small>Image pattern consistent with common leaf stress.</small>
                  </div>

                  {analysisProgress >= 100 && (
                    <div className="report-card severity-card">
                      <p>Severity</p>
                      <strong className="severity-badge moderate">
                        <AlertTriangle size={15} /> Moderate
                      </strong>
                      <small>Severity should be confirmed by a field inspection.</small>
                    </div>
                  )}
                </div>

                <div className="report-details">
                  <div className="info-stack">
                    <div className="info-block">
                      <span className="info-label">
                        <ShieldCheck size={15} /> Recommendations
                      </span>
                      <ul>
                        <li>Remove the most affected lower leaves.</li>
                        <li>Improve airflow around the canopy.</li>
                        <li>Apply a preventative fungicidal spray if local guidance supports it.</li>
                      </ul>
                    </div>

                    <div className="info-block">
                      <span className="info-label warning-label">
                        <AlertTriangle size={15} /> Warning
                      </span>
                      <ul>
                        <li>Do not rely on a single photo for a final diagnosis.</li>
                        <li>Follow local agronomy advice before heavy treatment.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="detector-footer-actions">
                  <button type="button" className="secondary-button" onClick={resetAnalysis}>
                    <Wand2 size={17} /> Analyze another image
                  </button>
                  <button type="button" className="primary-button" onClick={() => setPage('Overview')}>
                    <CheckCircle2 size={17} /> Save report
                  </button>
                </div>
              </div>
            </section>
          )}

          {page === 'Disease Library' && (
            <section className="library-section">
              <div className="library-heading">
                <div>
                  <span className="section-kicker">KNOW WHAT TO LOOK FOR</span>
                  <h3>Explore the disease library</h3>
                  <p>A little awareness goes a long way. Get to know the signs.</p>
                </div>

                <label className="search-field" aria-label="Search disease library">
                  <Search size={17} />
                  <input aria-label="Search crops or diseases" placeholder="Search crops or diseases" value={query} onChange={(e) => setQuery(e.target.value)} />
                </label>
              </div>

              <div className="disease-grid">
                {filtered.map((d) => (
                  <button key={d.name} className="disease-card" onClick={() => setChat(true)} type="button">
                    <div className="crop-art">
                      <img src={`/.netlify/images?url=/img/${d.image}.jpg&w=500&fm=webp`} alt={d.name} loading="lazy" />
                      <span>{d.crop}</span>
                    </div>
                    <div className="disease-copy">
                      <small>{d.type}</small>
                      <h4>
                        {d.name}
                        <ArrowRight size={17} />
                      </h4>
                      <p>Signs, care & prevention</p>
                    </div>
                  </button>
                ))}
              </div>

              {filtered.length === 0 && <p className="empty-state">No matching guides yet. Ask your AI assistant about this crop or disease.</p>}
            </section>
          )}
        </main>

        <footer className="app-footer">
          <span>
            <Sprout size={15} /> Made for the people who grow.
          </span>
          <span>AI insights support, and don’t replace, local expert advice.</span>
        </footer>
      </div>

      <button className="floating-chat" onClick={() => navigate('AI Assistant')} type="button">
        <Sparkles size={21} />
        <span>Ask Cropwise</span>
        <span className="chat-dot" />
      </button>

      <Dialog open={chat} onOpenChange={setChat}>
        <DialogContent className="chat-modal">
          <DialogHeader>
            <DialogTitle>
              <span className="assistant-icon">
                <Sparkles size={21} />
              </span>
              Your Cropwise assistant
            </DialogTitle>
            <DialogDescription>A little guidance for whatever’s growing.</DialogDescription>
          </DialogHeader>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'assistant' ? 'assistant-message' : 'user-message'}>
                {message.text}
              </div>
            ))}
            {chatBusy && <div className="assistant-message thinking">Finding a helpful answer…</div>}
          </div>

          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              void send()
            }}
          >
            <button type="button" className="composer-icon-button" aria-label="Attach image" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={17} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(event) => handleImageSelection(event.target.files?.[0])} />

            <textarea
              aria-label="Your question"
              rows={1}
              placeholder="Ask anything about your crops…"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />

            <button type="button" className="composer-icon-button mic-button" aria-label="Voice note">
              <Mic size={17} />
            </button>
            <button type="submit" disabled={chatBusy || !question.trim()} aria-label="Send question" className="send-button">
              <Send size={17} />
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}































































































































