export const mobileHeroQuery = '(max-width: 768px)';

export function initMobileHeader() {
  const header = document.querySelector('.mobile-header');
  const toggle = header.querySelector('button');
  const navigation = header.querySelector('nav');
  const mobile = window.matchMedia(mobileHeroQuery);
  function setOpen(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.inert = !open;
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false); toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
}
