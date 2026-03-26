// ─────────────────────────────
//  PRODUCT DATA
// ─────────────────────────────
const products = [
  // Electronics
  { id: 1,  name: "iPhone 15 Pro",            cat: "Electronics",     price: 134999, oldPrice: 149999, rating: 4.8, reviews: 1240,  emoji: "📱", badge: "hot"  },
  { id: 2,  name: "Sony WH-1000XM5",          cat: "Electronics",     price: 24999,  oldPrice: 29999,  rating: 4.7, reviews: 890,   emoji: "🎧", badge: "sale" },
  { id: 3,  name: 'Samsung 4K OLED TV 55"',   cat: "Electronics",     price: 89999,  oldPrice: null,   rating: 4.6, reviews: 430,   emoji: "📺", badge: "new"  },
  { id: 4,  name: "MacBook Air M3",            cat: "Electronics",     price: 119999, oldPrice: 129999, rating: 4.9, reviews: 2100,  emoji: "💻", badge: "hot"  },
  { id: 5,  name: "Canon EOS R50",             cat: "Electronics",     price: 62999,  oldPrice: null,   rating: 4.5, reviews: 320,   emoji: "📷", badge: null   },

  // Fashion
  { id: 6,  name: "Levi's 501 Original Jeans", cat: "Fashion",        price: 3999,   oldPrice: 5999,   rating: 4.4, reviews: 780,   emoji: "👖", badge: "sale" },
  { id: 7,  name: "Nike Air Max 270",           cat: "Fashion",        price: 9999,   oldPrice: 12999,  rating: 4.6, reviews: 1560,  emoji: "👟", badge: "hot"  },
  { id: 8,  name: "Silk Evening Gown",          cat: "Fashion",        price: 7499,   oldPrice: null,   rating: 4.3, reviews: 210,   emoji: "👗", badge: "new"  },
  { id: 9,  name: "Leather Crossbody Bag",      cat: "Fashion",        price: 2499,   oldPrice: 3999,   rating: 4.2, reviews: 540,   emoji: "👜", badge: "sale" },
  { id: 10, name: "Aviator Sunglasses",         cat: "Fashion",        price: 1799,   oldPrice: null,   rating: 4.5, reviews: 390,   emoji: "🕶️", badge: null  },

  // Home Appliances
  { id: 11, name: "Dyson V15 Vacuum",           cat: "Home Appliances", price: 49999, oldPrice: 59999,  rating: 4.7, reviews: 670,   emoji: "🧹", badge: "sale" },
  { id: 12, name: "Instant Pot Duo 7-in-1",     cat: "Home Appliances", price: 8999,  oldPrice: null,   rating: 4.8, reviews: 2300,  emoji: "🍲", badge: "hot"  },
  { id: 13, name: "LG Front Load Washer",        cat: "Home Appliances", price: 42999, oldPrice: 48999,  rating: 4.5, reviews: 430,   emoji: "🫧", badge: null   },
  { id: 14, name: "Philips Air Fryer XXL",       cat: "Home Appliances", price: 12999, oldPrice: 16999,  rating: 4.6, reviews: 870,   emoji: "🍟", badge: "sale" },
  { id: 15, name: "Dyson Purifier Hot+Cool",     cat: "Home Appliances", price: 38999, oldPrice: null,   rating: 4.4, reviews: 280,   emoji: "💨", badge: "new"  },

  // Books
  { id: 16, name: "Atomic Habits",              cat: "Books",           price: 399,   oldPrice: 499,    rating: 4.9, reviews: 15800, emoji: "📗", badge: "hot"  },
  { id: 17, name: "The Pragmatic Programmer",   cat: "Books",           price: 999,   oldPrice: null,   rating: 4.8, reviews: 4200,  emoji: "💻", badge: null   },
  { id: 18, name: "Sapiens: A Brief History",   cat: "Books",           price: 499,   oldPrice: 699,    rating: 4.7, reviews: 8900,  emoji: "📘", badge: "sale" },
  { id: 19, name: "Deep Work",                  cat: "Books",           price: 349,   oldPrice: null,   rating: 4.6, reviews: 3400,  emoji: "📙", badge: null   },
  { id: 20, name: "The Alchemist",              cat: "Books",           price: 299,   oldPrice: 399,    rating: 4.8, reviews: 12000, emoji: "📕", badge: "new"  },
];

// ─────────────────────────────
//  STATE
// ─────────────────────────────
let activeCategory = "All";
let activeRating   = 0;
let maxPriceFilter = 100000;
let searchQuery    = "";
let sortBy         = "default";
let cartItems      = [];
let wishlist       = new Set();

// ─────────────────────────────
//  RENDER PRODUCTS
// ─────────────────────────────
function renderProducts() {
  const grid     = document.getElementById("productGrid");
  const noResults = document.getElementById("noResults");

  // Filter
  let filtered = products.filter(p => {
    if (activeCategory !== "All" && p.cat !== activeCategory) return false;
    if (p.price > maxPriceFilter) return false;
    if (p.rating < activeRating) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort
  if (sortBy === "price-asc")   filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")  filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);
  if (sortBy === "name-asc")    filtered.sort((a, b) => a.name.localeCompare(b.name));

  // Update meta
  document.getElementById("resultCount").textContent =
    `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`;
  document.getElementById("sectionTitle").textContent =
    activeCategory === "All" ? "All Products" : activeCategory;

  // Remove old cards (keep #noResults)
  [...grid.children].forEach(c => { if (!c.id) c.remove(); });

  noResults.style.display = filtered.length === 0 ? "block" : "none";

  // Render cards
  filtered.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 0.05}s`;

    const stars     = renderStars(p.rating);
    const inWish    = wishlist.has(p.id);
    const badgeHtml = p.badge
      ? `<div class="card-badge ${p.badge}">${p.badge.toUpperCase()}</div>`
      : "";
    const oldPrice  = p.oldPrice
      ? `<span class="old">₹${p.oldPrice.toLocaleString("en-IN")}</span>`
      : "";

    card.innerHTML = `
      <div class="card-img">
        ${p.emoji}
        ${badgeHtml}
        <button class="wishlist-btn ${inWish ? "active" : ""}"
                onclick="toggleWish(event, ${p.id})">
          ${inWish ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-rating">
          <span class="card-stars">${stars}</span>
          <span class="card-rval">${p.rating} (${p.reviews.toLocaleString()})</span>
        </div>
        <div class="card-footer">
          <div class="card-price">
            ${oldPrice}
            ₹${p.price.toLocaleString("en-IN")}
          </div>
          <button class="add-cart" id="cart-${p.id}"
                  onclick="addToCart(event, ${p.id}, '${p.name}')">
            + Cart
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ─────────────────────────────
//  STAR RENDERER
// ─────────────────────────────
function renderStars(rating) {
  let s = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating))      s += "★";
    else if (i - 0.5 <= rating)       s += '<span style="opacity:0.6">★</span>';
    else                               s += "☆";
  }
  return s;
}

// ─────────────────────────────
//  CART
// ─────────────────────────────
function addToCart(e, id, name) {
  e.stopPropagation();
  cartItems.push(id);
  document.getElementById("cartCount").textContent = cartItems.length;

  const btn = document.getElementById(`cart-${id}`);
  btn.textContent = "✓ Added";
  btn.classList.add("added");
  setTimeout(() => {
    btn.textContent = "+ Cart";
    btn.classList.remove("added");
  }, 1500);

  showToast(`🛒 "${name}" added to cart!`);
}

function openCart() {
  showToast(`🛒 You have ${cartItems.length} item(s) in cart.`);
}

// ─────────────────────────────
//  WISHLIST
// ─────────────────────────────
function toggleWish(e, id) {
  e.stopPropagation();
  if (wishlist.has(id)) {
    wishlist.delete(id);
  } else {
    wishlist.add(id);
    showToast("❤️ Added to wishlist!");
  }
  renderProducts();
}

// ─────────────────────────────
//  TOAST
// ─────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2500);
}

// ─────────────────────────────
//  CATEGORY
// ─────────────────────────────
function setCategory(cat) {
  activeCategory = cat;

  document.querySelectorAll(".cat-chip").forEach(c =>
    c.classList.toggle("active", c.dataset.cat === cat));
  document.querySelectorAll(".cat-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.cat === cat));

  renderProducts();
}

document.getElementById("catChips").addEventListener("click", e => {
  const chip = e.target.closest("[data-cat]");
  if (chip) setCategory(chip.dataset.cat);
});

document.getElementById("catTabs").addEventListener("click", e => {
  const tab = e.target.closest("[data-cat]");
  if (tab) setCategory(tab.dataset.cat);
});

// ─────────────────────────────
//  PRICE SLIDER
// ─────────────────────────────
const slider = document.getElementById("priceSlider");

slider.addEventListener("input", () => {
  maxPriceFilter = +slider.value;
  document.getElementById("sliderVal").textContent =
    `₹${Number(slider.value).toLocaleString("en-IN")}`;
  document.getElementById("maxPrice").value = slider.value;
  renderProducts();
});

document.getElementById("maxPrice").addEventListener("input", e => {
  const v = Math.min(+e.target.value || 100000, 100000);
  maxPriceFilter = v;
  slider.value = v;
  document.getElementById("sliderVal").textContent = `₹${v.toLocaleString("en-IN")}`;
  renderProducts();
});

document.getElementById("minPrice").addEventListener("input", renderProducts);

// ─────────────────────────────
//  RATING FILTER
// ─────────────────────────────
document.getElementById("ratingOpts").addEventListener("click", e => {
  const opt = e.target.closest("[data-min]");
  if (!opt) return;
  activeRating = +opt.dataset.min;
  document.querySelectorAll(".rating-opt").forEach(o => o.classList.remove("active"));
  opt.classList.add("active");
  renderProducts();
});

// ─────────────────────────────
//  SORT
// ─────────────────────────────
document.getElementById("sortSelect").addEventListener("change", e => {
  sortBy = e.target.value;
  renderProducts();
});

// ─────────────────────────────
//  SEARCH
// ─────────────────────────────
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderProducts();
});

// ─────────────────────────────
//  CLEAR FILTERS
// ─────────────────────────────
function clearFilters() {
  activeCategory = "All";
  activeRating   = 0;
  maxPriceFilter = 100000;
  searchQuery    = "";
  sortBy         = "default";

  document.getElementById("searchInput").value  = "";
  document.getElementById("priceSlider").value  = 100000;
  document.getElementById("sliderVal").textContent = "₹1,00,000";
  document.getElementById("minPrice").value     = "";
  document.getElementById("maxPrice").value     = "";
  document.getElementById("sortSelect").value   = "default";

  document.querySelectorAll(".cat-chip").forEach(c =>
    c.classList.toggle("active", c.dataset.cat === "All"));
  document.querySelectorAll(".cat-tab").forEach(t =>
    t.classList.toggle("active", t.dataset.cat === "All"));
  document.querySelectorAll(".rating-opt").forEach((o, i) =>
    o.classList.toggle("active", i === 0));

  renderProducts();
}

// ─────────────────────────────
//  HAMBURGER (mobile nav)
// ─────────────────────────────
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("mobileNav").classList.toggle("open");
});

// ─────────────────────────────
//  FILTER TOGGLE (mobile)
// ─────────────────────────────
const filterToggle = document.getElementById("filterToggle");
if (filterToggle) {
  filterToggle.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
}

// ─────────────────────────────
//  INIT
// ─────────────────────────────
renderProducts();
