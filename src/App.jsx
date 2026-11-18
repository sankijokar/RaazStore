import { useState, useMemo } from 'react'
import './App.css'

const INITIAL_ITEMS = [
  { id: 1, name: "Heavyweight Tee · Bone", category: "T-Shirts", kind: "tee", color: "#EFEBE2", price: 1499, stock: 18, desc: "240 gsm organic cotton with tonal embroidery.", details: ["240 gsm", "Regular fit"], frontImg: "", backImg: "" },
  { id: 2, name: "Classic Tee · Black", category: "T-Shirts", kind: "tee", color: "#1c1c1c", price: 1299, stock: 25, desc: "Soft black tee with a clean finish.", details: ["Cotton", "Relaxed fit"], frontImg: "", backImg: "" },
  { id: 3, name: "Oxford Shirt · Sky", category: "Shirts & Knits", kind: "long", color: "#9cc4ee", price: 2499, stock: 12, desc: "Light button-down for everyday wear.", details: ["Poplin", "Slim fit"], frontImg: "", backImg: "" },
  { id: 4, name: "Knit Sweater · Olive", category: "Shirts & Knits", kind: "long", color: "#6f7a3c", price: 3299, stock: 4, desc: "Chunky knit, warm and breathable.", details: ["Wool blend", "Boxy"], frontImg: "", backImg: "" },
  { id: 5, name: "Pullover Hoodie · Grey", category: "Hoodies", kind: "hoodie", color: "#b4b4b6", price: 2999, stock: 15, desc: "Heavy fleece hoodie with kangaroo pocket.", details: ["400 gsm", "Oversized"], frontImg: "", backImg: "" },
  { id: 6, name: "Hoodie · Lilac", category: "Hoodies", kind: "hoodie", color: "#b9a0e6", price: 2799, stock: 9, desc: "Soft lilac hoodie, brushed inside.", details: ["Fleece", "Regular"], frontImg: "", backImg: "" },
  { id: 7, name: "Pocket Tee · Forest", category: "T-Shirts", kind: "tee", color: "#1f5a35", price: 1599, stock: 20, desc: "Deep green tee with chest pocket.", details: ["Cotton", "Regular"], frontImg: "", backImg: "" },
  { id: 8, name: "Sweatshirt · Rust", category: "Shirts & Knits", kind: "long", color: "#b5543a", price: 2199, stock: 3, desc: "Crewneck sweatshirt, garment dyed.", details: ["Terry", "Relaxed"], frontImg: "", backImg: "" },
  { id: 9, name: "Breton Stripe · Navy", category: "Shirts & Knits", kind: "stripe", color: "#161b2e", price: 1899, stock: 14, desc: "Classic striped long sleeve.", details: ["Jersey", "Slim"], frontImg: "", backImg: "" },
  { id: 10, name: "Oversized Tee · Ochre", category: "T-Shirts", kind: "tee", color: "#d9a02a", price: 1699, stock: 11, desc: "Boxy ochre tee with a bold back print.", details: ["Boxy", "Cotton"], frontImg: "", backImg: "" }
]

const PATH = {
  tee: "M30 8 L42 8 Q50 20 58 8 L70 8 L96 30 L84 48 L72 40 L72 122 L28 122 L28 40 L16 48 L4 30 Z",
  long: "M30 8 L42 8 Q50 20 58 8 L70 8 L98 40 L92 112 L80 110 L74 56 L72 122 L28 122 L26 56 L20 110 L8 112 L2 40 Z",
  hoodie: "M30 10 L42 8 Q50 22 58 8 L70 10 L98 40 L92 112 L80 110 L74 56 L72 122 L28 122 L26 56 L20 110 L8 112 L2 40 Z"
}

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

function shade(color, amount) {
  const n = parseInt(color.slice(1), 16)
  const r = n >> 16
  const g = (n >> 8) & 255
  const b = n & 255
  const clamp = (v) => Math.max(0, Math.min(255, v + amount))
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`
}

function isDark(color) {
  const n = parseInt(color.slice(1), 16)
  return ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) < 125
}

function GarmentMedia({ item, back = false }) {
  const image = back ? (item.backImg || item.frontImg) : item.frontImg

  if (image?.trim()) {
    return (
      <img
        src={image}
        alt={`${item.name} ${back ? 'back' : 'front'}`}
        className="garment-image"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    )
  }

  const id = `garment-${item.id}-${back ? 'back' : 'front'}`
  const path = PATH[item.kind === 'stripe' ? 'long' : item.kind]
  const fill = item.kind === 'stripe' ? `url(#${id}-stripe)` : item.color
  const textColor = isDark(item.color) ? '#fff' : '#171717'

  return (
    <svg viewBox="0 0 100 130" className="garment-svg" aria-label={item.name}>
      <defs>
        {item.kind === 'stripe' && (
          <pattern id={`${id}-stripe`} width="100" height="10" patternUnits="userSpaceOnUse">
            <rect width="100" height="10" fill="#f4f1ea" />
            <rect width="100" height="5" fill={item.color} />
          </pattern>
        )}
        <linearGradient id={`${id}-shade`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".12" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".16" />
        </linearGradient>
      </defs>
      {item.kind === 'hoodie' && (
        <path d="M32 10 Q50 -8 68 10 Q50 30 32 10Z" fill={shade(item.color, -25)} />
      )}
      <path d={path} fill={fill} />
      <path d={path} fill={`url(#${id}-shade)`} />
      {back ? (
        <text x="50" y="60" textAnchor="middle" fontSize="10" fontWeight="700" fill={textColor} opacity=".8">STUDIO</text>
      ) : (
        <circle cx="62" cy="34" r="2.2" fill={textColor} opacity=".6" />
      )}
    </svg>
  )
}

function SectionHeading({ eyebrow, title, right }) {
  return (
    <div className="section-heading-new">
      <div>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {right && <span className="section-heading-right">{right}</span>}
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront')
  const [items, setItems] = useState(INITIAL_ITEMS)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [orders, setOrders] = useState([
    { id: '#ORD-1042', customer: 'Aarav Sharma', itemsCount: 2, total: 4498, status: 'Delivered' },
    { id: '#ORD-1043', customer: 'Priya Verma', itemsCount: 1, total: 2999, status: 'Shipped' }
  ])

  const categories = ['All', 'T-Shirts', 'Shirts & Knits', 'Hoodies']

  const totalStock = items.reduce((sum, item) => sum + item.stock, 0)
  const totalBagCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const bagValue = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const lowStock = items.filter((item) => item.stock <= 5).length

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory
      const searchMatch = item.name.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })

    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [items, selectedCategory, search, sort])

  const addToCart = (item) => {
    const existing = cart.find((product) => product.id === item.id)
    const qtyAlreadyInCart = existing?.qty || 0

    if (item.stock <= qtyAlreadyInCart) {
      alert('Maximum available stock is already in your bag.')
      return
    }

    setCart((prev) => {
      const found = prev.find((product) => product.id === item.id)
      return found
        ? prev.map((product) => product.id === item.id ? { ...product, qty: product.qty + 1 } : product)
        : [...prev, { ...item, qty: 1 }]
    })
    setCartOpen(true)
  }

  const updateCartQty = (id, delta) => {
    const product = items.find((item) => item.id === id)
    const current = cart.find((item) => item.id === id)
    if (!current || !product) return

    const nextQty = current.qty + delta
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }

    if (nextQty > product.stock) {
      alert('You cannot add more than the available stock.')
      return
    }

    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty: nextQty } : item))
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id))

  const updateStock = (id, delta) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ))
  }

  const updateImageUrl = (id, field, value) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const checkout = () => {
    if (!cart.length) return

    // Validate stock again before checkout.
    const stockIssue = cart.some((cartItem) => {
      const current = items.find((item) => item.id === cartItem.id)
      return !current || cartItem.qty > current.stock
    })

    if (stockIssue) {
      alert('Stock changed. Please review your bag before checkout.')
      return
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const count = cart.reduce((sum, item) => sum + item.qty, 0)

    setItems((prev) => prev.map((item) => {
      const purchased = cart.find((cartItem) => cartItem.id === item.id)
      return purchased ? { ...item, stock: item.stock - purchased.qty } : item
    }))

    const orderNumber = 1042 + orders.length
    setOrders((prev) => [{
      id: `#ORD-${orderNumber}`,
      customer: 'Guest Customer',
      itemsCount: count,
      total,
      status: 'Processing'
    }, ...prev])

    setCart([])
    setCartOpen(false)
    setActiveTab('orders')
  }

  const openStore = () => {
    setActiveTab('storefront')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const productCard = (item) => (
    <article className="product-card-new" key={item.id}>
      <div className="product-image-new">
        <GarmentMedia item={item} />
        <span className="product-label">
          {item.stock <= 5 ? 'LOW STOCK' : 'STUDIO EDIT'}
        </span>
        <button
          className="quick-add"
          onClick={() => addToCart(item)}
          disabled={item.stock === 0}
        >
          {item.stock === 0 ? 'SOLD OUT' : 'QUICK ADD +'}
        </button>
      </div>
      <div className="product-info-new">
        <div className="product-name-price">
          <h3>{item.name}</h3>
          <span>{money(item.price)}</span>
        </div>
        <p>{item.desc}</p>
        <div className="product-meta">
          <span className="color-dot" style={{ background: item.color }} />
          <span>{item.category}</span>
          <span className="stock-caption">{item.stock} available</span>
        </div>
      </div>
    </article>
  )

  return (
    <div className="studio-app">
      {/* NAVIGATION */}
      <nav className="navbar navbar-new">
        <button className="brand brand-new" onClick={openStore}>STUDIO RAIL<span>.</span></button>

        <div className="nav-links nav-new">
          <button className={activeTab === 'storefront' ? 'active-tab' : ''} onClick={openStore}>Shop</button>
          <button className={activeTab === 'inventory' ? 'active-tab' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button className={activeTab === 'orders' ? 'active-tab' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        </div>

        <button className="cart-btn cart-new" onClick={() => setCartOpen(true)}>
          BAG <span>{totalBagCount.toString().padStart(2, '0')}</span>
        </button>
      </nav>

      {/* STORE */}
      {activeTab === 'storefront' && (
        <>
          <main>
            <section className="campaign-hero">
              <div className="campaign-image">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85"
                  alt="RaaZ Store fashion collection"
                />
              </div>
              <div className="campaign-overlay" />
              <div className="campaign-content">
                <p className="campaign-eyebrow">RaaZ Store · SEASON 026</p>
                <h1>Wear less.<br />Wear better.</h1>
                <p className="campaign-description">
                  Everyday essentials. Thoughtful fits.<br />
                  Pieces made to stay in your rotation.
                </p>
                <button className="campaign-cta" onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}>
                  EXPLORE COLLECTION <span>↗</span>
                </button>
              </div>
              <span className="campaign-side-note">NEW SEASON / 2026</span>
            </section>

            <section className="brand-note">
              <span>01 — THE STUDIO</span>
              <p>Everyday clothing, <em>considered.</em><br />Designed for movement. Made for repeat wear.</p>
              <span className="brand-note-bottom">ESSENTIALS WITH INTENTION</span>
            </section>

            <section className="collection-section" id="collection">
              <SectionHeading
                eyebrow="THE CURRENT ROTATION"
                title="Shop the collection"
                right={`${filteredItems.length} PRODUCTS`}
              />

              <div className="catalog-toolbar">
                <div className="category-filters">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={selectedCategory === category ? 'filter-active' : ''}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="catalog-actions">
                  <input
                    className="catalog-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search collection..."
                  />
                  <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              {filteredItems.length ? (
                <div className="product-grid-new">
                  {filteredItems.map(productCard)}
                </div>
              ) : (
                <div className="empty-results">
                  <p>No products found.</p>
                  <button onClick={() => { setSearch(''); setSelectedCategory('All') }}>Clear filters</button>
                </div>
              )}
            </section>

            <section className="collection-banner">
              <div>
                <span>STUDIO RAIL / NOTES</span>
                <h2>Good clothes.<br />No noise.</h2>
                <p>Clean silhouettes. Honest details. A wardrobe that works harder.</p>
              </div>
              <div className="banner-mark">SR.</div>
            </section>

            <section className="store-stat-strip">
              <div><span>01</span><p>Thoughtful<br />essentials</p></div>
              <div><span>02</span><p>Made for<br />everyday wear</p></div>
              <div><span>03</span><p>Free shipping on<br />orders above ₹1,999</p></div>
            </section>
          </main>
        </>
      )}

      {/* INVENTORY */}
      {activeTab === 'inventory' && (
        <main className="admin-main">
          <div className="admin-topline">
            <div>
              <p className="admin-eyebrow">RAAZ STORE / ADMIN</p>
              <h1>Inventory overview</h1>
              <p className="admin-subtitle">Manage your collection, stock levels and product images.</p>
            </div>
            <button className="admin-back" onClick={openStore}>← View storefront</button>
          </div>

          <div className="admin-stats">
            <div className="admin-stat">
              <span>TOTAL PRODUCTS</span>
              <strong>{items.length.toString().padStart(2, '0')}</strong>
            </div>
            <div className="admin-stat">
              <span>STOCK UNITS</span>
              <strong>{totalStock}</strong>
            </div>
            <div className="admin-stat">
              <span>LOW STOCK ITEMS</span>
              <strong className={lowStock ? 'warning-number' : ''}>{lowStock}</strong>
            </div>
            <div className="admin-stat">
              <span>ORDERS PLACED</span>
              <strong>{orders.length}</strong>
            </div>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Products & stock</h2>
                <p>Update inventory and add product image links.</p>
              </div>
              <span className="admin-live-label">● LIVE IN SESSION</span>
            </div>

            <div className="inventory-table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>FRONT IMAGE URL</th>
                    <th>BACK IMAGE URL</th>
                    <th>PRICE</th>
                    <th>STOCK STATUS</th>
                    <th>QUANTITY</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="inventory-product">
                          <div className="inventory-thumb">
                            <GarmentMedia item={item} />
                          </div>
                          <div>
                            <strong>{item.name}</strong>
                            <small>{item.category}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input
                          className="image-url-input"
                          value={item.frontImg}
                          onChange={(e) => updateImageUrl(item.id, 'frontImg', e.target.value)}
                          placeholder="Paste front image URL"
                        />
                      </td>
                      <td>
                        <input
                          className="image-url-input"
                          value={item.backImg}
                          onChange={(e) => updateImageUrl(item.id, 'backImg', e.target.value)}
                          placeholder="Paste back image URL"
                        />
                      </td>
                      <td>{money(item.price)}</td>
                      <td>
                        <span className={`stock-status ${item.stock <= 5 ? 'stock-low' : 'stock-good'}`}>
                          {item.stock === 0 ? 'Out of stock' : item.stock <= 5 ? 'Low stock' : 'In stock'}
                        </span>
                      </td>
                      <td>
                        <div className="stock-controls">
                          <button onClick={() => updateStock(item.id, -1)} disabled={item.stock === 0}>−</button>
                          <strong>{item.stock}</strong>
                          <button onClick={() => updateStock(item.id, 1)}>+</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (
        <main className="admin-main">
          <div className="admin-topline">
            <div>
              <p className="admin-eyebrow">STUDIO RAIL / ADMIN</p>
              <h1>Order management</h1>
              <p className="admin-subtitle">Your recent orders and fulfillment status.</p>
            </div>
            <button className="admin-back" onClick={openStore}>← View storefront</button>
          </div>

          <div className="admin-stats">
            <div className="admin-stat"><span>TOTAL ORDERS</span><strong>{orders.length}</strong></div>
            <div className="admin-stat"><span>PROCESSING</span><strong>{orders.filter(o => o.status === 'Processing').length}</strong></div>
            <div className="admin-stat"><span>SHIPPED</span><strong>{orders.filter(o => o.status === 'Shipped').length}</strong></div>
            <div className="admin-stat"><span>DELIVERED</span><strong>{orders.filter(o => o.status === 'Delivered').length}</strong></div>
          </div>

          <section className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Recent orders</h2>
                <p>Orders created in this demo session.</p>
              </div>
            </div>
            <div className="inventory-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ORDER</th>
                    <th>CUSTOMER</th>
                    <th>ITEMS</th>
                    <th>ORDER VALUE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>{order.customer}</td>
                      <td>{order.itemsCount} pieces</td>
                      <td>{money(order.total)}</td>
                      <td><span className={`order-status order-${order.status.toLowerCase()}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer footer-new">
        <div className="footer-main">
          <div>
            <h2>RAAZ  STORE<span>.</span></h2>
            <p>Everyday essentials, thoughtfully selected.</p>
          </div>
          <div className="footer-links">
            <button onClick={openStore}>Shop collection</button>
            <button onClick={() => setActiveTab('inventory')}>Inventory</button>
            <button onClick={() => setActiveTab('orders')}>Orders</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RAZ E-comm</span>
          <span>MADE FOR EVERYDAY.</span>
          <span>INDIA</span>
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer cart-new-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-top">
              <div className="cart-heading">
                <div>
                  <p>YOUR SELECTION</p>
                  <h2>Your bag <span>({totalBagCount})</span></h2>
                </div>
                <button className="cart-close" onClick={() => setCartOpen(false)}>×</button>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <span>YOUR BAG IS EMPTY</span>
                  <p>Find something worth keeping.</p>
                  <button onClick={() => { setCartOpen(false); openStore() }}>EXPLORE COLLECTION ↗</button>
                </div>
              ) : (
                <div className="cart-items-new">
                  {cart.map((product) => (
                    <div className="cart-item-new" key={product.id}>
                      <div className="cart-product-img">
                        <GarmentMedia item={product} />
                      </div>
                      <div className="cart-product-details">
                        <h3>{product.name}</h3>
                        <p>{product.category}</p>
                        <strong>{money(product.price)}</strong>
                        <div className="cart-quantity">
                          <button onClick={() => updateCartQty(product.id, -1)}>−</button>
                          <span>{product.qty}</span>
                          <button onClick={() => updateCartQty(product.id, 1)}>+</button>
                          <button className="cart-remove" onClick={() => removeFromCart(product.id)}>REMOVE</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-summary-new">
                <div className="shipping-note">
                  {bagValue >= 1999
                    ? 'You qualify for free shipping.'
                    : `Add ${money(1999 - bagValue)} more for free shipping.`}
                </div>
                <div className="cart-total-line">
                  <span>Subtotal</span>
                  <strong>{money(bagValue)}</strong>
                </div>
                <div className="cart-total-line cart-total-small">
                  <span>Shipping</span>
                  <span>{bagValue >= 1999 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <button className="checkout-btn" onClick={checkout}>PLACE DEMO ORDER ↗</button>
                <p className="checkout-disclaimer">Demo checkout — no payment is collected.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}