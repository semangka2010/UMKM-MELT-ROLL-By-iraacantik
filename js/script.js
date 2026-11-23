// KONFIGURASI NOMOR WHATSAPP ADMIN - 081262895243
const ADMIN_WHATSAPP = "6281262895243";

// DATA PRODUK
const products = [
  {
    id: 1,
    name: "MeltRoll Matcha Greentea",
    badge: "Best Seller",
    price: 10000,
    description: "Pisang gulung renyah dengan siraman glaze matcha autentik yang manis-pahit seimbang dan wangi.",
    image: "assets/produk1.jpg"
  },
  {
    id: 2,
    name: "MeltRoll Cokelat Lumer",
    badge: "Favorit",
    price: 10000,
    description: "Lelehan cokelat pekat premium di bagian dalam dan topping cokelat melimpah di setiap potongan.",
    image: "assets/produk2.jpg"
  },
  {
    id: 3,
    name: "MeltRoll Taro Ungu",
    badge: "Creamy",
    price: 10000,
    description: "Sensasi manis lembut talas ungu yang creamy berpadu sempurna dengan kulit lumpia krispi.",
    image: "assets/produk3.jpg"
  }
];

// DATA ULASAN AWAL
const initialReviews = [
  {
    name: "Nadia Rahma",
    variant: "MeltRoll Matcha Greentea",
    rating: 5,
    text: "Matcha-nya kerasa banget, nggak kemanisan dan kulit luarnya tetap kriuk walau sudah sampai rumah!"
  },
  {
    name: "Dimas Pratama",
    variant: "MeltRoll Cokelat Lumer",
    rating: 5,
    text: "Cokelatnya beneran lumer sampai tumpah-tumpah. Porsinya pas dan harganya ramah di kantong."
  }
];

let cart = [];
let selectedRating = 5;

// FORMAT RUPIAH
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
}

// TAMPILKAN NOTIFIKASI TOAST
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// RENDER KATALOG PRODUK
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}">
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${formatRupiah(product.price)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
            <i class="fa-solid fa-plus"></i> Tambah
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// LOGIKA KERANJANG
function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  const existing = cart.find(c => c.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
  showToast(`${item.name} ditambahkan ke keranjang`);
}

function changeQty(productId, delta) {
  const index = cart.findIndex(c => c.id === productId);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById("cartItemsContainer");
  const badge = document.getElementById("cartBadge");
  const totalEl = document.getElementById("cartTotalAmount");
  const footer = document.getElementById("cartFooter");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  badge.textContent = totalItems;
  totalEl.textContent = formatRupiah(totalPrice);

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Keranjang pesananmu masih kosong.<br>Yuk pilih menu MeltRoll favoritmu!</p>
      </div>
    `;
    footer.style.display = "none";
  } else {
    footer.style.display = "block";
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>${formatRupiah(item.price * item.qty)}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join("");
  }
}

// CHECKOUT KE WHATSAPP
function checkoutWhatsApp() {
  if (cart.length === 0) return;

  const customerName = document.getElementById("customerNameInput").value.trim() || "Pelanggan";
  const deliveryMethod = document.getElementById("deliveryMethod").value;
  const notes = document.getElementById("orderNotes").value.trim();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  let orderList = cart.map((item, idx) =>
    `${idx + 1}. ${item.name} (${item.qty}x) - ${formatRupiah(item.price * item.qty)}`
  ).join("\n");

  let message = `Halo Admin *MeltRoll*! Saya ingin memesan:\n\n` +
    `*Nama:* ${customerName}\n` +
    `*Metode:* ${deliveryMethod}\n\n` +
    `*Detail Pesanan:*\n${orderList}\n\n` +
    `*Total:* ${formatRupiah(totalPrice)}`;

  if (notes) {
    message += `\n*Catatan:* ${notes}`;
  }

  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

// RENDER ULASAN
function renderReviews(reviews) {
  const list = document.getElementById("reviewsList");
  list.innerHTML = reviews.map(rev => `
    <div class="review-card">
      <div class="review-top">
        <div class="reviewer-meta">
          <strong>${rev.name}</strong>
          <span>${rev.variant}</span>
        </div>
        <div class="review-stars">
          ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating)}
        </div>
      </div>
      <p>"${rev.text}"</p>
    </div>
  `).join("");
}

// INISIALISASI SAAT HALAMAN DIMUAT
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  renderReviews(initialReviews);

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });

  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  document.getElementById("openCartBtn").addEventListener("click", () => {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
  });

  const closeCart = () => {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
  };
  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  document.getElementById("checkoutWaBtn").addEventListener("click", checkoutWhatsApp);

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      lightboxImg.src = img.src;
      lightboxCaption.textContent = item.dataset.caption || "";
      lightbox.classList.add("open");
    });
  });

  document.getElementById("lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("open");
  });

  const stars = document.querySelectorAll("#starSelector i");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.rating);
      stars.forEach(s => {
        s.classList.toggle("active", Number(s.dataset.rating) <= selectedRating);
      });
    });
  });

  document.getElementById("reviewForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reviewerName").value.trim();
    const variant = document.getElementById("reviewVariant").value;
    const text = document.getElementById("reviewText").value.trim();

    initialReviews.unshift({ name, variant, rating: selectedRating, text });
    renderReviews(initialReviews);
    e.target.reset();
    showToast("Terima kasih atas ulasanmu!");
  });
});