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