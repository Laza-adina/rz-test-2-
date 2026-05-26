// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('active'));
}
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => { if (mainNav) mainNav.classList.remove('active'); });
});

// Header scroll shadow
const header = document.querySelector('.main-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
      siblings.forEach((el, idx) => setTimeout(() => el.classList.add('visible'), idx * 110));
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// KPI counter
function animateCounter(el, target, suffix) {
  let val = 0;
  const dur = 1600, step = 16;
  const inc = target / (dur / step);
  const isFloat = String(target).includes('.');
  const t = setInterval(() => {
    val += inc;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
  }, step);
}
const kpiMap = { '70': [70, ''], '99.4%': [99.4, '%'], '100%': [100, '%'] };
const kpiObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const key = el.dataset.raw;
      if (kpiMap[key]) {
        animateCounter(el, kpiMap[key][0], kpiMap[key][1]);
        kpiObserver.unobserve(el);
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.kpi-number').forEach(el => {
  const raw = el.textContent.trim();
  if (kpiMap[raw]) { el.dataset.raw = raw; kpiObserver.observe(el); }
});

// File upload
const fileInput = document.getElementById('c_cv');
const fileDisplay = document.getElementById('fileNameDisplay');
if (fileInput && fileDisplay) {
  fileInput.addEventListener('change', () => {
    fileDisplay.textContent = fileInput.files[0]?.name || 'Aucun fichier sélectionné';
  });
}

// Share modal
const shareBtn = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const modalClose = document.querySelector('.modal-close');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const shareLinkInput = document.getElementById('shareLinkInput');
const qrImage = document.getElementById('qrImage');
const printQrBtn = document.getElementById('printQrBtn');

if (shareBtn && shareModal) {
  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    if (shareLinkInput) shareLinkInput.value = url;
    if (qrImage) qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
    shareModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  const close = () => { shareModal.classList.remove('active'); document.body.style.overflow = ''; };
  if (modalClose) modalClose.addEventListener('click', close);
  shareModal.addEventListener('click', e => { if (e.target === shareModal) close(); });
  if (copyLinkBtn && shareLinkInput) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copié !';
        setTimeout(() => { copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i> Copier'; }, 2000);
      });
    });
  }
  if (printQrBtn) printQrBtn.addEventListener('click', () => window.print());
}

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.main-nav .nav-link:not(.btn-nav-primary):not(.btn-nav-secondary)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(link => {
    link.style.color = (link.getAttribute('href') || '').includes(current) && current ? 'var(--brand-main)' : '';
  });
}, { passive: true });

// ---- Service Modal ----
const serviceData = {
  volume: {
    title: "Transport Volume",
    icon: "fas fa-truck-moving",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    desc: "Acheminement optimal de vos marchandises par camion de 20 m³ en lots sur palettes. Idéal pour la liaison inter-sites et les flux d'approvisionnement critiques. Nous assurons le chargement sécurisé, la traçabilité en temps réel et la ponctualité de chaque rotation. Nos véhicules sont équipés pour le transport de palettes Europe et industrielles, avec hayon élévateur disponible sur demande."
  },
  route: {
    title: "Livraison Petite Route",
    icon: "fas fa-shipping-fast",
    img: "https://images.unsplash.com/photo-1516542008748-1d139d366f6a?auto=format&fit=crop&w=800&q=80",
    desc: "Gestion externalisée de vos tournées quotidiennes en fourgon. Capacité opérationnelle élevée avec une moyenne rigoureuse de 70 livraisons par jour. Nos chauffeurs sont briefés sur vos procédures de livraison, de collecte de signatures et de gestion des échecs. Nous couvrons les zones urbaines et périurbaines avec une organisation de tournées optimisée pour minimiser les retards."
  },
  velo: {
    title: "Livraison à Vélo",
    icon: "fas fa-bicycle",
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    desc: "Solutions du dernier kilomètre ultra-rapides et décarbonées pour petits colis. Agilité maximale au cœur des centres-villes denses. Zéro émission, zéro congestion : nos cyclistes naviguent là où les fourgons sont bloqués. Idéal pour les envois urgents, les flux e-commerce et les livraisons en immeubles de bureaux. Une solution écoresponsable qui améliore votre bilan carbone et l'image de marque de votre enseigne."
  }
};

const serviceModal = document.getElementById('serviceModal');
const serviceModalClose = document.getElementById('serviceModalClose');

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.service;
    const data = serviceData[key];
    document.getElementById('serviceModalImg').src = data.img;
    document.getElementById('serviceModalImg').alt = data.title;
    document.getElementById('serviceModalIcon').className = data.icon;
    document.getElementById('serviceModalTitle').textContent = data.title;
    document.getElementById('serviceModalDesc').textContent = data.desc;
    serviceModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

serviceModalClose.addEventListener('click', closeServiceModal);
serviceModal.addEventListener('click', e => { if (e.target === serviceModal) closeServiceModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeServiceModal(); });

function closeServiceModal() {
  serviceModal.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleServiceCard(card) {
  const wasExpanded = card.classList.contains('expanded');
  document.querySelectorAll('.service-card-new.expanded').forEach(c => c.classList.remove('expanded'));
  if (!wasExpanded) card.classList.add('expanded');
}