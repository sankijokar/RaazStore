import { useState, useRef, useEffect } from 'react'
import './App.css'

const ITEMS = [
  { id: 1, name: "Heavyweight tee · Bone", kind: "tee", color: "#EFEBE2", price: 1499, desc: "240 gsm organic cotton with tonal embroidery.", details: ["240 gsm", "Regular fit"] },
  { id: 2, name: "Classic tee · Black", kind: "tee", color: "#1c1c1c", price: 1299, desc: "Soft black tee with clean finish.", details: ["Cotton", "Relaxed fit"] },
  { id: 3, name: "Oxford shirt · Sky", kind: "long", color: "#9cc4ee", price: 2499, desc: "Light button-down for everyday wear.", details: ["Poplin", "Slim fit"] },
  { id: 4, name: "Knit sweater · Olive", kind: "long", color: "#6f7a3c", price: 3299, desc: "Chunky knit, warm and breathable.", details: ["Wool blend", "Boxy"] },
  { id: 5, name: "Pullover hoodie · Grey", kind: "hoodie", color: "#b4b4b6", price: 2999, desc: "Heavy fleece hoodie with kangaroo pocket.", details: ["400 gsm", "Oversized"] },
  { id: 6, name: "Hoodie · Lilac", kind: "hoodie", color: "#b9a0e6", price: 2799, desc: "Soft lilac hoodie, brushed inside.", details: ["Fleece", "Regular"] },
  { id: 7, name: "Pocket tee · Forest", kind: "tee", color: "#1f5a35", price: 1599, desc: "Deep green tee with chest pocket.", details: ["Cotton", "Regular"] },
  { id: 8, name: "Sweatshirt · Rust", kind: "long", color: "#b5543a", price: 2199, desc: "Crewneck sweatshirt, garment dyed.", details: ["Terry", "Relaxed"] },
  { id: 9, name: "Breton stripe · Navy", kind: "stripe", color: "#161b2e", price: 1899, desc: "Classic striped long sleeve.", details: ["Jersey", "Slim"] },
  { id: 10, name: "Oversized tee · Ochre", kind: "tee", color: "#d9a02a", price: 1699, desc: "Boxy ochre tee with small chest mark and large back print.", details: ["Boxy", "Cotton"] }
]

const PATH = {
  tee: "M30 8 L42 8 Q50 20 58 8 L70 8 L96 30 L84 48 L72 40 L72 122 L28 122 L28 40 L16 48 L4 30 Z",
  long: "M30 8 L42 8 Q50 20 58 8 L70 8 L98 40 L92 112 L80 110 L74 56 L72 122 L28 122 L26 56 L20 110 L8 112 L2 40 Z",
  hoodie: "M30 10 L42 8 Q50 22 58 8 L70 10 L98 40 L92 112 L80 110 L74 56 L72 122 L28 122 L26 56 L20 110 L8 112 L2 40 Z"
}

function shade(c, a) {
  const n = parseInt(c.slice(1), 16)
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255
  const f = v => Math.max(0, Math.min(255, Math.round(v + a)))
  return `rgb(${f(r)},${f(g)},${f(b)})`
}

function isDark(c) {
  const n = parseInt(c.slice(1), 16)
  return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) < 110
}

function GarmentSVG({ item, back }) {
  const k = item.kind === "stripe" ? "long" : item.kind
  const uid = `p-${item.id}-${back ? 'b' : 'f'}`
  const fill = item.kind === "stripe" ? `url(#${uid})` : item.color

  return (
    <svg viewBox="0 0 100 130">
      <defs>
        {item.kind === "stripe" && (
          <pattern id={uid} width="100" height="10" patternUnits="userSpaceOnUse">
            <rect width="100" height="10" fill="#f4f1ea" />
            <rect width="100" height="5" fill={item.color} />
          </pattern>
        )}
        <linearGradient id={`${uid}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".12" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
      {item.kind === "hoodie" && (
        <path d="M32 10 Q50 -8 68 10 Q50 30 32 10Z" fill={shade(item.color, -25)} />
      )}
      <path d={PATH[k]} fill={fill} />
      <path d={PATH[k]} fill={`url(#${uid}g)`} />
      {back ? (
        <text x="50" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill={isDark(item.color) ? '#fff' : '#111'} opacity=".85" fontFamily="sans-serif">BACK</text>
      ) : (
        <circle cx="62" cy="34" r="2.2" fill={isDark(item.color) ? '#fff' : '#111'} opacity=".6" />
      )}
    </svg>
  )
}

export default function App() {
  const [activeIdx, setActiveIdx] = useState(-1)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const scrollerRef = useRef(null)
  const itemRefs = useRef([])
  const dragState = useRef({ down: false, sx: 0, sl: 0, moved: 0, lastScroll: 0, drive: 0 })

  useEffect(() => {
    const physics = ITEMS.map((_, i) => ({ a: 0, v: 0, k: 0.05 + (i % 3) * 0.008 }))
    let animId

    const loop = () => {
      const push = Math.max(-3, Math.min(3, dragState.current.drive))
      dragState.current.drive *= 0.8

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const s = physics[i]
        s.v += push * 0.9 * (1 + (i % 4) * 0.06) - s.a * s.k * 3
        s.v *= 0.9
        s.a += s.v
        s.a = Math.max(-28, Math.min(28, s.a))
        el.style.transform = `rotate(${s.a.toFixed(2)}deg)`
      })
      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  const handlePointerDown = (e) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    dragState.current.down = true
    dragState.current.moved = 0
    dragState.current.sx = e.clientX
    dragState.current.sl = scroller.scrollLeft
  }

  const handlePointerMove = (e) => {
    if (!dragState.current.down || !scrollerRef.current) return
    const dx = e.clientX - dragState.current.sx
    dragState.current.moved = Math.max(dragState.current.moved, Math.abs(dx))
    if (dragState.current.moved > 5) setIsDragging(true)
    scrollerRef.current.scrollLeft = dragState.current.sl - dx
  }

  const handlePointerUp = () => {
    dragState.current.down = false
    setIsDragging(false)
  }

  const handleScroll = () => {
    if (!scrollerRef.current) return
    const cur = scrollerRef.current.scrollLeft
    dragState.current.drive = dragState.current.lastScroll - cur
    dragState.current.lastScroll = cur
  }

  const handleSelect = (i) => {
    if (dragState.current.moved > 5) return
    if (activeIdx === i) {
      setActiveIdx(-1)
      return
    }
    setActiveIdx(i)
    const el = itemRefs.current[i]?.parentElement
    const scroller = scrollerRef.current
    if (el && scroller) {
      const r = el.getBoundingClientRect()
      const s = scroller.getBoundingClientRect()
      scroller.scrollTo({
        left: scroller.scrollLeft + r.left - s.left - (s.width - r.width) / 2,
        behavior: 'smooth'
      })
    }
  }

  const addToCart = (item) => {
    setCart((prev) => [...prev, item])
    setCartOpen(true)
  }

  const selectedItem = activeIdx >= 0 ? ITEMS[activeIdx] : null
  const totalRevenue = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div>
      <nav className="navbar">
        <div className="brand">STUDIO RAIL.</div>
        <div className="nav-links">
          <span className="active-tab">Storefront</span>
          <span>Inventory (10)</span>
          <span>Analytics</span>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          Bag ({cart.length})
        </button>
      </nav>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Active Collection</div>
          <div className="stat-val">10 Pieces</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Current Bag Value</div>
          <div className="stat-val">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Season Status</div>
          <div className="stat-val" style={{ color: '#1f5a35' }}>Live</div>
        </div>
      </div>

      <section className="hero">
        <div className="eyebrow">New season · ten pieces on the rail</div>
        <h1>A clothing rail you can handle, right on the page.</h1>

        <div
          ref={scrollerRef}
          className={`scroller ${isDragging ? 'drag' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onScroll={handleScroll}
        >
          <div className="track">
            <div className="bar"></div>
            {ITEMS.map((item, i) => {
              const isActive = activeIdx === i
              const isDim = activeIdx !== -1 && !isActive
              return (
                <div
                  key={item.id}
                  className={`item ${isActive ? 'active' : ''} ${isDim ? 'dim' : ''}`}
                  onClick={() => handleSelect(i)}
                >
                  <div className="sway" ref={(el) => (itemRefs.current[i] = el)}>
                    <svg className="hanger" viewBox="0 0 64 30">
                      <path d="M32 2 Q38 2 38 8 Q38 12 32 14" fill="none" stroke="#777" strokeWidth="2" />
                      <path d="M32 14 L4 27 Q2 28 4 29 L60 29 Q62 28 60 27 Z" fill="#c8985a" />
                    </svg>
                    <div className="lift">
                      <div className="turn">
                        <div className="face">
                          <GarmentSVG item={item} back={false} />
                        </div>
                        <div className="face back">
                          <GarmentSVG item={item} back={true} />
                        </div>
                        <span className="tag">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="detail">
          {selectedItem ? (
            <>
              <h2>{selectedItem.name}</h2>
              <p>{selectedItem.desc}</p>
              <div className="chips">
                {selectedItem.details.map((d, idx) => (
                  <span key={idx}>{d}</span>
                ))}
                <span>₹{selectedItem.price}</span>
              </div>
              <button className="btn" onClick={() => addToCart(selectedItem)}>
                Add to Bag · ₹{selectedItem.price}
              </button>
            </>
          ) : (
            <p className="hint">
              Rail pe slide karo, hanger ke upar hover karo, kisi piece pe click karke peeche ka side dekho.
            </p>
          )}
        </div>
      </section>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3>Your Bag ({cart.length})</h3>
                <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>
              {cart.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>Abhi bag khali hai. Rail se koi kapda select karke add karo.</p>
              ) : (
                cart.map((c, idx) => (
                  <div key={idx} className="cart-item">
                    <span>{c.name}</span>
                    <strong>₹{c.price}</strong>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontWeight: '700' }}>
                  <span>Total</span>
                  <span>₹{totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <button className="btn" style={{ width: '100%' }} onClick={() => { alert('Order Placed!'); setCart([]); setCartOpen(false); }}>
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}