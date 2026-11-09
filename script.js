document.documentElement.classList.add('js');
const header = document.querySelector('#header');
const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
let previousY = window.scrollY;
let scheduled = false;
const closeMenu = () => {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
};
menuToggle.addEventListener('click', () => {
  const opening = mobileMenu.hidden;
  mobileMenu.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  header.classList.remove('header-hidden');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  window.requestAnimationFrame(() => {
    const currentY = Math.max(0, window.scrollY);
    header.classList.toggle('scrolled', currentY > 30);
    if (Math.abs(currentY - previousY) > 5) {
      header.classList.toggle('header-hidden', currentY > previousY && currentY > 140 && mobileMenu.hidden && !header.contains(document.activeElement));
      previousY = currentY;
    }
    if (currentY < 80) header.classList.remove('header-hidden');
    scheduled = false;
  });
}, { passive: true });
header.addEventListener('focusin', () => header.classList.remove('header-hidden'));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); } });
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
document.querySelector('#year').textContent = new Date().getFullYear();
const privacyModal = document.querySelector('#privacy-modal');
const imageModal = document.querySelector('#image-modal');
const openModal = modal => { modal.showModal(); document.body.classList.add('modal-open'); };
document.querySelector('#privacy-open').addEventListener('click', () => openModal(privacyModal));
document.querySelectorAll('dialog').forEach(modal => {
  modal.querySelectorAll('.modal-close, .modal-dismiss').forEach(button => button.addEventListener('click', () => modal.close()));
  modal.addEventListener('click', event => {
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  });
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
});
document.querySelectorAll('.gallery-item').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#expanded-image').src = button.dataset.image;
  document.querySelector('#expanded-image').alt = button.dataset.caption;
  document.querySelector('#image-caption').textContent = button.dataset.caption;
  openModal(imageModal);
}));

const whatsappModal = document.querySelector('#whatsapp-modal');
document.querySelectorAll('[data-whatsapp]').forEach(button => button.addEventListener('click', () => openModal(whatsappModal)));
whatsappModal.querySelectorAll('.whatsapp-option').forEach(link => link.addEventListener('click', () => {
  whatsappModal.close();
  closeMenu();
}));
