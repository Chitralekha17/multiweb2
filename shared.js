// ============================================================
//  STRYDE SHARED DATA & STATE
// ============================================================

const PRODUCTS = [
  { id:1,  name:'APEX RUNNER X',      category:'Running',    price:189, oldPrice:null, emoji:'👟', tag:'new',  colors:['#e8ff00','#111','#fff'],   sizes:[6,7,8,9,10,11,12], desc:'Engineered for speed, built for endurance. The Apex Runner X features a responsive foam midsole and breathable upper for all-day comfort.',    rating:4.8, reviews:124 },
  { id:2,  name:'URBAN GLIDE 2',      category:'Lifestyle',  price:149, oldPrice:199, emoji:'👟', tag:'sale', colors:['#fff','#444','#e8ff00'],    sizes:[6,7,8,9,10,11],    desc:'From streets to studios, the Urban Glide 2 adapts to every scene. Sleek silhouette meets supreme cushioning for effortless style.',             rating:4.6, reviews:89  },
  { id:3,  name:'STORM FORCE HI',     category:'Basketball', price:219, oldPrice:null, emoji:'🥾', tag:'hot',  colors:['#ff4136','#111','#fff'],   sizes:[7,8,9,10,11,12],   desc:'Dominate the court with ankle support and explosive traction. Storm Force Hi is built for players who refuse to hold back.',                      rating:4.9, reviews:203 },
  { id:4,  name:'CLOUD WALK 3',       category:'Casual',     price:129, oldPrice:null, emoji:'👠', tag:'new',  colors:['#c8b8a2','#111','#e8ff00'],sizes:[5,6,7,8,9,10],     desc:'Step into cloud-like comfort. Ultra-light construction and memory foam insole make the Cloud Walk 3 perfect for all-day wear.',                    rating:4.5, reviews:67  },
  { id:5,  name:'TRAIL BLAZER PRO',   category:'Outdoor',    price:239, oldPrice:299, emoji:'🥾', tag:'sale', colors:['#5a7a3a','#8b5e3c','#111'],sizes:[7,8,9,10,11,12],   desc:'Conquer any terrain. Waterproof upper, aggressive lug sole, and reinforced toe cap make this the ultimate outdoor companion.',                      rating:4.7, reviews:156 },
  { id:6,  name:'SPEED BURST ELITE',  category:'Running',    price:259, oldPrice:null, emoji:'👟', tag:'hot',  colors:['#e8ff00','#ff4136','#fff'],sizes:[6,7,8,9,10,11,12], desc:'Race-day performance in every stride. Carbon fiber plate and nitrogen-infused foam deliver explosive energy return.',                                 rating:4.9, reviews:312 },
  { id:7,  name:'RETRO COURT LOW',    category:'Lifestyle',  price:109, oldPrice:null, emoji:'👟', tag:null,   colors:['#fff','#111','#c41e3a'],   sizes:[6,7,8,9,10,11],    desc:'Classic court heritage reimagined for today. Clean lines, premium leather upper, and vintage sole unit that never goes out of style.',               rating:4.4, reviews:45  },
  { id:8,  name:'FLEXI STRIDE 5',     category:'Training',   price:169, oldPrice:null, emoji:'👟', tag:'new',  colors:['#4169e1','#fff','#e8ff00'],sizes:[6,7,8,9,10,11,12], desc:'Versatile cross-training shoe built for gym sessions, HIIT, and everything in between. Stable base with flexible forefoot.',                         rating:4.6, reviews:78  },
  { id:9,  name:'NIGHT HAWK BOOST',   category:'Running',    price:199, oldPrice:229, emoji:'👟', tag:'sale', colors:['#111','#e8ff00','#333'],   sizes:[7,8,9,10,11],      desc:'Designed for the night runners. Reflective details, high-vis accents, and superior grip for confident running in low-light conditions.',              rating:4.7, reviews:91  },
  { id:10, name:'PIVOT PRO MID',      category:'Basketball', price:229, oldPrice:null, emoji:'👟', tag:'new',  colors:['#fff','#111','#4169e1'],   sizes:[8,9,10,11,12],     desc:'Elite ankle lockdown and multi-directional grip. Pivot Pro Mid keeps you stable through every cut, drive, and landing.',                             rating:4.8, reviews:137 },
  { id:11, name:'TERRA HIKE LITE',    category:'Outdoor',    price:179, oldPrice:null, emoji:'🥾', tag:null,   colors:['#8b5e3c','#5a7a3a','#111'],sizes:[6,7,8,9,10,11,12], desc:'Lightweight trail hikers with serious protection. EVA midsole, vibram outsole, and moisture-wicking lining for backcountry adventures.',             rating:4.5, reviews:62  },
  { id:12, name:'GLAM STEP HEEL',     category:'Casual',     price:139, oldPrice:159, emoji:'👠', tag:'sale', colors:['#c41e3a','#c8b8a2','#111'],sizes:[5,6,7,8,9],        desc:'Dress to impress without sacrificing comfort. Padded footbed and block heel provide all-day elegance for every occasion.',                           rating:4.3, reviews:38  },
];

const CATEGORIES = [
  { name:'Running',    count:48, emoji:'👟', bg:'#0e1a0e' },
  { name:'Lifestyle',  count:62, emoji:'👠', bg:'#0e0e1a' },
  { name:'Basketball', count:34, emoji:'🏀', bg:'#1a0e0e' },
  { name:'Training',   count:27, emoji:'💪', bg:'#1a150e' },
  { name:'Outdoor',    count:41, emoji:'🥾', bg:'#0e1510' },
  { name:'Casual',     count:55, emoji:'✨', bg:'#150e1a' },
];

// ---- Cart & Wishlist (in-memory, shared via window) --------
window.STORE = window.STORE || {
  cart: JSON.parse(localStorage.getItem('stryde_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('stryde_wishlist') || '[]'),
  save() {
    localStorage.setItem('stryde_cart', JSON.stringify(this.cart));
    localStorage.setItem('stryde_wishlist', JSON.stringify(this.wishlist));
  },
  addToCart(id, size) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const key = `${id}_${size}`;
    const ex = this.cart.find(x => x.key === key);
    if (ex) ex.qty++;
    else this.cart.push({ key, id, size, qty: 1, name: p.name, price: p.price, emoji: p.emoji });
    this.save(); updateCartBadge();
  },
  removeFromCart(key) {
    this.cart = this.cart.filter(x => x.key !== key);
    this.save(); updateCartBadge();
  },
  updateQty(key, delta) {
    const item = this.cart.find(x => x.key === key);
    if (item) { item.qty = Math.max(1, item.qty + delta); this.save(); updateCartBadge(); }
  },
  toggleWishlist(id) {
    const idx = this.wishlist.indexOf(id);
    if (idx > -1) this.wishlist.splice(idx, 1);
    else this.wishlist.push(id);
    this.save();
  },
  isWishlisted(id) { return this.wishlist.includes(id); },
  cartTotal() { return this.cart.reduce((s, i) => s + i.price * i.qty, 0); },
  cartCount() { return this.cart.reduce((s, i) => s + i.qty, 0); },
};

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = window.STORE.cartCount();
    el.style.display = window.STORE.cartCount() > 0 ? 'flex' : 'none';
  });
}

function showToast(msg, type = 'success') {
  let t = document.getElementById('globalToast');
  if (!t) { t = document.createElement('div'); t.id = 'globalToast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'g-toast ' + type;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}
