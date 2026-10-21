import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, BookOpen, Camera, CircleHelp, ImagePlus, Leaf, Menu, MessageCircle, ScanLine, Search, Send, ShieldCheck, Sparkles, Sprout, Sun, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { diseases } from '@/lib/diseases'
import { Marquee } from '@/components/ui/marquee'

export const Route = createFileRoute('/')({ component: Home })

type Message = { role: 'user' | 'assistant'; text: string }

function Home() {
  const [page, setPage] = useState('Overview')
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const [chat, setChat] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello, grower. Tell me what’s happening in your field or garden. What crop are you growing, and what have you noticed?' },
  ])
  const [question, setQuestion] = useState('')
  const [chatBusy, setChatBusy] = useState(false)

  const filtered = diseases.filter((d) => `${d.name} ${d.crop}`.toLowerCase().includes(query.toLowerCase()))

  function navigate(next: string) {
    setMenu(false)
    if (next === 'AI Assistant') {
      setChat(true)
      return
    }
    setPage(next)
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

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? 'is-open' : ''}`}>
        <a href="/" className="brand">
          <span className="brand-mark"><Sprout size={25} /></span>
          cropwise<span className="brand-dot">.</span>
        </a>

        <div className="workspace-label">YOUR GROWING COMPANION</div>

        <nav>
          {['Overview', 'Disease Detector', 'Disease Library', 'AI Assistant'].map((name) => (
            <button
              key={name}
              className={page === name || (name === 'AI Assistant' && chat) ? 'nav-item active' : 'nav-item'}
              onClick={() => navigate(name)}
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
            <span className="grow-icon"><Leaf size={18} /></span>
            <h3>A little care.</h3>
            <p>Your crops have a story. Let’s help them thrive.</p>
            <span className="mini-leaf"><Sprout size={18} strokeWidth={1.2} /></span>
          </div>
          <button className="nav-item" onClick={() => setChat(true)}>
            <span className="nav-icon"><CircleHelp size={18} /></span>
            Help & getting started
            <ArrowRight size={15} />
          </button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMenu(!menu)}>
              <Menu />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>

          <div className="top-actions">
            <span className="live-dot" />
            Your crop health companion
            <button aria-label="Crop health tips" onClick={() => setChat(true)}>
              <Sparkles size={18} />
            </button>
            <span className="avatar small">G</span>
          </div>
        </header>

        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow"><Sun size={15} /> GOOD THINGS START WITH HEALTHY CROPS</div>
              <h1>{page === 'Disease Library' ? 'A little knowledge. A healthier field.' : page === 'Disease Detector' ? 'Let’s take a closer look.' : page === 'AI Assistant' ? 'A growing companion.' : 'A healthier crop starts here.'}</h1>
              <p>{page === 'Disease Library' ? 'Explore common symptoms, treatment options, and ways to prevent disease.' : 'Spot the signs early. Understand the problem. Grow with confidence.'}</p>
            </div>
            <span className="nature-tag"><span /> Rooted in better growing</span>
          </div>

          {page === 'Overview' && (
            <>
              <Marquee items={['Leaf health', 'Soil care', 'AI scouting', 'Better yields', 'Field notes', 'Healthy roots']} />

              <section className="hero">
                <img src="/.netlify/images?url=/img/crop-hero.png&w=1500&fm=webp" alt="Sunlight falling on fresh green tomato leaves" />
                <div className="hero-shade" />
                <div className="hero-copy">
                  <span className="hero-tag"><Sparkles size={14} /> POWERED BY AI. INSPIRED BY NATURE.</span>
                  <h2>Small signs.<br />Big possibilities.</h2>
                  <p>Turn a photo into a first step toward healthier crops. Get insight and a clear path forward.</p>
                  <button className="light-button" onClick={() => setPage('Disease Detector')}>
                    Check your crop <ArrowRight size={17} />
                  </button>
                </div>
                <div className="hero-note">
                  <span><Leaf size={17} /></span>
                  <div>
                    Healthy plants. Happy harvests.
                    <small>A little attention makes a world of difference.</small>
                  </div>
                </div>
              </section>

              <div className="feature-strip">
                <div>
                  <span><ScanLine size={18} /></span>
                  <section>
                    <strong>A photo is all it takes</strong>
                    <p>Simple, image-based assessment</p>
                  </section>
                </div>
                <div>
                  <span><Leaf size={18} /></span>
                  <section>
                    <strong>From insight to action</strong>
                    <p>Practical care & prevention guidance</p>
                  </section>
                </div>
                <div>
                  <span><MessageCircle size={18} /></span>
                  <section>
                    <strong>A companion, anytime</strong>
                    <p>Ask your personal AI assistant</p>
                  </section>
                </div>
              </div>
            </>
          )}

          {page !== 'Disease Library' && (
            <div className="work-grid">
              <section className="scanner-panel panel">
                <div className="section-heading">
                  <div>
                    <span className="section-kicker">LET’S GET TO THE ROOT OF IT</span>
                    <h2>Check your crop’s health <Leaf size={20} /></h2>
                    <p>Upload a clear photo. We’ll help you understand what’s happening.</p>
                  </div>
                  <span className="step-label">001 / UPLOAD</span>
                </div>

                <div className="scan-fields">
                  <label htmlFor="crop">Select your crop</label>
                  <div className="select-wrap">
                    <select id="crop" defaultValue="Auto-detect crop">
                      <option>Auto-detect crop</option>
                      <option>Tomato</option>
                      <option>Rice</option>
                      <option>Maize</option>
                      <option>Wheat</option>
                    </select>
                    <ChevronRight size={16} />
                  </div>
                </div>

                <div className="upload-box">
                  <input type="file" accept="image/*" hidden />
                  <div className="upload-icon"><ImagePlus size={28} /></div>
                  <h3>Drop your crop photo here</h3>
                  <p>or <button className="inline-link">browse files</button> to upload</p>
                  <small>JPEG, PNG, or WEBP up to 4 MB</small>
                </div>

                <button className="primary-button" onClick={() => setPage('Disease Detector')}>
                  <ScanLine size={18} /> Analyze crop
                </button>
              </section>

              <aside className="right-column">
                <section className="assistant-card">
                  <div className="assistant-top">
                    <span className="assistant-icon"><Sparkles size={22} /></span>
                    <span className="available"><span /> HERE TO HELP</span>
                  </div>
                  <h2>A growing companion.<br />Just for you.</h2>
                  <p>From unusual leaf spots to everyday crop care, your AI assistant is here to help.</p>
                  <button className="text-button" onClick={() => setChat(true)}>
                    Let’s talk crops <ArrowRight size={16} />
                  </button>
                </section>

                <section className="tips-card panel">
                  <div className="tips-heading">
                    <span><Sun size={18} /></span>
                    <strong>A field note</strong>
                    <span className="tiny-label">GROW SMARTER</span>
                  </div>
                  <h3>Catch it early. Keep it healthy.</h3>
                  <p>Check the undersides of leaves, too. Early signs of pests and disease often hide there.</p>
                  <button className="text-button" onClick={() => setChat(true)}>
                    More growing tips <ArrowRight size={15} />
                  </button>
                </section>
              </aside>
            </div>
          )}

          {page === 'Disease Library' && (
            <section className="library-section">
              <div className="library-heading">
                <div>
                  <span className="section-kicker">KNOW WHAT TO LOOK FOR</span>
                  <h2>Explore the disease library</h2>
                  <p>A little awareness goes a long way. Get to know the signs.</p>
                </div>
                <label className="search-field">
                  <Search size={17} />
                  <input aria-label="Search disease library" placeholder="Search crops or diseases" value={query} onChange={(e) => setQuery(e.target.value)} />
                </label>
              </div>

              <div className="disease-grid">
                {filtered.map((d) => (
                  <button key={d.name} className="disease-card" onClick={() => setChat(true)}>
                    <div className="crop-art">
                      <img src={`/.netlify/images?url=/img/${d.image}.jpg&w=500&fm=webp`} alt={d.name} loading="lazy" />
                      <span>{d.crop}</span>
                    </div>
                    <div className="disease-copy">
                      <small>{d.type}</small>
                      <h3>{d.name}<ArrowRight size={17} /></h3>
                      <p>Signs, care & prevention</p>
                    </div>
                  </button>
                ))}
              </div>

              {filtered.length === 0 && <p className="empty-state">No matching guides yet. Ask your AI assistant about this crop or disease.</p>}
            </section>
          )}
        </main>

        <footer>
          <span><Sprout size={15} /> Made for the people who grow.</span>
          <span>AI insights support, and don’t replace, local expert advice.</span>
        </footer>
      </div>

      <button className="floating-chat" onClick={() => setChat(true)}>
        <Sparkles size={21} />
        <span>Ask Cropwise</span>
        <span className="chat-dot" />
      </button>

      <Dialog open={chat} onOpenChange={setChat}>
        <DialogContent className="chat-modal">
          <DialogHeader>
            <DialogTitle>
              <span className="assistant-icon"><Sparkles size={21} /></span>
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
            <input
              aria-label="Your question"
              placeholder="Ask anything about your crops…"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
            <button type="submit" disabled={chatBusy || !question.trim()} aria-label="Send question">
              <Send size={18} />
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={false} onOpenChange={() => undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cropwise guidance</DialogTitle>
            <DialogDescription>Helpful growing info.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
