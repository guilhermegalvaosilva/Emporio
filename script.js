const linkVendidos = document.querySelector(".catbar__link--hot");
const secVendidos = document.getElementById("maisVendidos");

// Se não tiver seção, deixa o link funcionar normalmente (vai para mais-vendidos.html)
if (linkVendidos && secVendidos) {
  linkVendidos.addEventListener("click", (e) => {
    e.preventDefault();

    const abrir = !secVendidos.classList.contains("ativo");
    secVendidos.classList.toggle("ativo", abrir);
    secVendidos.setAttribute("aria-hidden", String(!abrir));

    if (abrir) {
      secVendidos.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

(() => {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero__slide"));
  const dotsWrap = slider.querySelector(".hero__dots");
  const prevBtn = slider.querySelector(".hero__nav--prev");
  const nextBtn = slider.querySelector(".hero__nav--next");

  const titleEl = document.getElementById("heroTitle");
  const subtitleEl = document.getElementById("heroSubtitle");

  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 5500;

  // dots
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
    titleEl.textContent = t;
    subtitleEl.textContent = s;
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

(() => {
  const slider = document.getElementById("promoSlider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".promo__slide"));
  const prevBtn = slider.querySelector(".promo__nav--prev");
  const nextBtn = slider.querySelector(".promo__nav--next");
  const bar = document.getElementById("promoBar");
  const ticks = document.getElementById("promoTicks");

  // cria divisórias conforme quantidade
  ticks.innerHTML = "";
  slides.forEach(() => ticks.appendChild(document.createElement("span")));

  let index = 0;
  let timer = null;
  const DURATION = 5200; // tempo de cada banner

  function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
    restartProgress();
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    restartAuto();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  function startAuto() {
    timer = setInterval(next, DURATION);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // barra animada
  function restartProgress() {
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    // força repaint
    bar.offsetHeight;
    bar.style.transition = `width ${DURATION}ms linear`;
    bar.style.width = "100%";
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // pausa no hover (premium)
  slider.addEventListener("mouseenter", () => {
    stopAuto();
    if (bar) bar.style.transition = "none";
  });

  slider.addEventListener("mouseleave", () => {
    restartProgress();
    startAuto();
  });

  render();
  startAuto();
})();

const track = document.querySelector(".products__track");
const prev = document.querySelector(".products__nav--prev");
const next = document.querySelector(".products__nav--next");

if (track && prev && next) {
  next.addEventListener("click", () => {
    track.scrollBy({ left: 300, behavior: "smooth" });
  });

  prev.addEventListener("click", () => {
    track.scrollBy({ left: -300, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== Carrossel (setas) =====
  const track = document.getElementById("mvTrack");
  const prev = document.querySelector(".mv__nav--prev");
  const next = document.querySelector(".mv__nav--next");

  if (track && prev && next) {
    next.addEventListener("click", () => {
      track.scrollBy({ left: 340, behavior: "smooth" });
    });

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -340, behavior: "smooth" });
    });
  }

  // ===== Pills (peso) + WhatsApp dinâmico =====
  const WHATSAPP_NUMBER = "55SEUNUMERO"; // <-- TROCA AQUI (ex: 5561999999999)

  document.querySelectorAll(".card").forEach((card) => {
    const pills = card.querySelectorAll(".pill");
    const waBtn = card.querySelector(".card__wa");

    function updateWhatsAppLink() {
      const product = card.getAttribute("data-product") || "Produto";
      const weight = card.getAttribute("data-weight") || "";
      const msg = `Olá! Quero pedir: ${product}${weight ? ` (${weight})` : ""}.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      if (waBtn) waBtn.href = url;
    }

    // inicializa link
    updateWhatsAppLink();

    pills.forEach((p) => {
      p.addEventListener("click", () => {
        // marca ativo
        pills.forEach((x) => x.classList.remove("is-active"));
        p.classList.add("is-active");

        // salva peso no card
        const w = p.getAttribute("data-weight") || p.textContent.trim();
        card.setAttribute("data-weight", w);

        // atualiza link do WhatsApp
        updateWhatsAppLink();
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("reviewsTrack");
  const prev = document.querySelector(".reviews__nav--prev");
  const next = document.querySelector(".reviews__nav--next");

  if (track && prev && next) {
    next.addEventListener("click", () => {
      track.scrollBy({ left: 320, behavior: "smooth" });
    });

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -320, behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("igTrack");
  const prev = document.querySelector(".ig__nav--prev");
  const next = document.querySelector(".ig__nav--next");

  if (track && prev && next) {
    next.addEventListener("click", () => {
      track.scrollBy({ left: 360, behavior: "smooth" });
    });
    prev.addEventListener("click", () => {
      track.scrollBy({ left: -360, behavior: "smooth" });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ===== Setas: funcionam em qualquer prateleira =====
  document.querySelectorAll(".shelf__nav").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-target");
      const track = document.getElementById(id);
      if (!track) return;

      const dir = btn.classList.contains("shelf__nav--next") ? 1 : -1;
      track.scrollBy({ left: 340 * dir, behavior: "smooth" });
    });
  });

  // ===== WhatsApp dinâmico + pills =====
  const WHATSAPP_NUMBER = "55SEUNUMERO"; // ex: 5561999999999

  document.querySelectorAll(".pcard").forEach((card) => {
    const pills = card.querySelectorAll(".ppill");
    const wa = card.querySelector(".pcard__wa");

    function updateWA() {
      const product = card.getAttribute("data-product") || "Produto";
      const weight = card.getAttribute("data-weight") || "";
      const msg = `Olá! Quero pedir: ${product}${weight ? ` (${weight})` : ""}.`;
      if (wa)
        wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    updateWA();

    pills.forEach((p) => {
      p.addEventListener("click", () => {
        pills.forEach((x) => x.classList.remove("is-active"));
        p.classList.add("is-active");
        card.setAttribute(
          "data-weight",
          p.getAttribute("data-weight") || p.textContent.trim(),
        );
        updateWA();
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("yearNow");
  if (el) el.textContent = new Date().getFullYear();
});

const phone = "5561999999999"; // DDI + DDD + número (sem espaços)
const msg = "Olá! Quero fazer um pedido na BioVida.";
const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

const floatBtn = document.getElementById("wppFloat");
const footerBtn = document.getElementById("footerWhatsLink");

if (floatBtn) floatBtn.href = link;
if (footerBtn) footerBtn.href = link;
