/* =========================
   + VENDIDOS (corrigido)
========================= */
(() => {
  const linkVendidos = document.querySelector(".catbar__link--hot");
  const secVendidos =
    document.getElementById("mais-vendidos") ||
    document.getElementById("maisVendidos");

  if (!linkVendidos || !secVendidos) return;

  linkVendidos.addEventListener("click", (e) => {
    e.preventDefault();
    secVendidos.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

/* =========================
   HERO SLIDER (seguro)
========================= */
(() => {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero__slide"));
  const dotsWrap = slider.querySelector(".hero__dots");
  const prevBtn = slider.querySelector(".hero__nav--prev");
  const nextBtn = slider.querySelector(".hero__nav--next");

  if (!slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

  const titleEl = document.getElementById("heroTitle");
  const subtitleEl = document.getElementById("heroSubtitle");

  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 5500;

  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "hero__dot" + (i === 0 ? " is-active" : "");
    b.setAttribute("aria-label", "Ir para o slide " + (i + 1));
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".hero__dot"));

  function applyText() {
    const active = slides[index];
    const t = active.getAttribute("data-title") || "BioVida";
    const s = active.getAttribute("data-subtitle") || "";
    if (titleEl) titleEl.textContent = t;
    if (subtitleEl) subtitleEl.textContent = s;
  }

  function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
    applyText();
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    restart();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function start() {
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function restart() {
    stop();
    start();
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  render();
  start();
})();

/* =========================
   MV (carrossel setas)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("mvTrack");
  const prev = document.querySelector(".mv__nav--prev");
  const next = document.querySelector(".mv__nav--next");

  if (!track || !prev || !next) return;

  next.addEventListener("click", () => {
    track.scrollBy({ left: 340, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -340, behavior: "smooth" });
  });
});

/* =========================
   REVIEWS (carrossel)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("reviewsTrack");
  const prev = document.querySelector(".reviews__nav--prev");
  const next = document.querySelector(".reviews__nav--next");

  if (!track || !prev || !next) return;

  next.addEventListener("click", () => {
    track.scrollBy({ left: 320, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -320, behavior: "smooth" });
  });
});

/* =========================
   IG (carrossel)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("igTrack");
  const prev = document.querySelector(".ig__nav--prev");
  const next = document.querySelector(".ig__nav--next");

  if (!track || !prev || !next) return;

  next.addEventListener("click", () => {
    track.scrollBy({ left: 360, behavior: "smooth" });
  });
  prev.addEventListener("click", () => {
    track.scrollBy({ left: -360, behavior: "smooth" });
  });
});

/* =========================
   WHATSAPP (footer)
========================= */
(() => {
  const phone = "5561999999999"; // DDI + DDD + número
  const msg = "Olá! Quero fazer um pedido na BioVida.";
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  const footerBtn = document.getElementById("footerWhatsLink");
  if (footerBtn) footerBtn.href = link;
})();

/* =========================
   CARRINHO (principal)
   - Comprar adiciona e abre drawer
   - Finalizar compra vai pro checkout
========================= */
(() => {
  const CHECKOUT_URL = "/checkout.html";
  const storageKey = "biovida_cart_v1";

  const fmt = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  };
  const saveCart = (cart) =>
    localStorage.setItem(storageKey, JSON.stringify(cart));

  let cart = loadCart();

  // UI
  const overlay = document.getElementById("overlay");
  const drawer = document.getElementById("drawer");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");
  const cartFab = document.getElementById("cartFab");
  const closeCart = document.getElementById("closeCart");
  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!overlay || !drawer || !cartItems || !cartTotal || !cartCount) return;

  function openCart() {
    overlay.classList.add("is-open");
    drawer.classList.add("is-open");
  }
  function closeCartUI() {
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
  }

  function qtyTotal() {
    return Object.values(cart).reduce((acc, x) => acc + x.qty, 0);
  }
  function valueTotal() {
    return Object.values(cart).reduce((acc, x) => acc + x.qty * x.price, 0);
  }

  function renderCart() {
    const items = Object.values(cart);
    cartCount.textContent = qtyTotal();

    if (items.length === 0) {
      cartItems.innerHTML = `<div class="empty">Seu carrinho está vazio.</div>`;
      cartTotal.textContent = fmt(0);
      return;
    }

    cartItems.innerHTML = items
      .map(
        (it) => `
          <div class="cart-item">
            <img class="cart-item__img" src="${it.img}" alt="${it.name}">
            <div>
              <p class="cart-item__name">${it.name}</p>
              <div class="cart-item__meta">
                <span>${fmt(it.price)}</span>
                <span>${it.id}</span>
              </div>

              <div class="qty">
                <button type="button" data-dec="${it.id}">−</button>
                <span>${it.qty}</span>
                <button type="button" data-inc="${it.id}">+</button>
              </div>

              <button class="remove" type="button" data-rem="${it.id}">Remover</button>
            </div>
          </div>
        `,
      )
      .join("");

    cartTotal.textContent = fmt(valueTotal());
  }

  function addItem({ id, name, price, img }) {
    if (!id || !name || !price) return;

    const p = Number(price);
    if (Number.isNaN(p)) return;

    if (!cart[id]) {
      cart[id] = {
        id,
        name,
        price: p,
        img: img || "/img/nuts.bio.jpg",
        qty: 1,
      };
    } else {
      cart[id].qty += 1;
    }

    saveCart(cart);
    renderCart();
  }

  function inc(id) {
    if (!cart[id]) return;
    cart[id].qty += 1;
    saveCart(cart);
    renderCart();
  }
  function dec(id) {
    if (!cart[id]) return;
    cart[id].qty -= 1;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    renderCart();
  }
  function rem(id) {
    if (!cart[id]) return;
    delete cart[id];
    saveCart(cart);
    renderCart();
  }

  // ✅ Clique em qualquer botão com [data-add] -> adiciona e abre carrinho
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    e.preventDefault();

    addItem({
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: btn.dataset.price,
      img: btn.dataset.img,
    });

    openCart();
  });

  // Drawer open/close
  cartFab?.addEventListener("click", openCart);
  closeCart?.addEventListener("click", closeCartUI);
  overlay?.addEventListener("click", closeCartUI);

  // Drawer actions
  cartItems?.addEventListener("click", (e) => {
    const a = e.target.closest("[data-inc]");
    const b = e.target.closest("[data-dec]");
    const c = e.target.closest("[data-rem]");
    if (a) inc(a.dataset.inc);
    if (b) dec(b.dataset.dec);
    if (c) rem(c.dataset.rem);
  });

  clearCartBtn?.addEventListener("click", () => {
    cart = {};
    saveCart(cart);
    renderCart();
  });

  checkoutBtn?.addEventListener("click", () => {
    if (Object.values(cart).length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }
    window.location.href = CHECKOUT_URL;
  });

  // init
  renderCart();
})();
