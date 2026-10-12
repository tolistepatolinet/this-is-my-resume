import { mobileHeroQuery } from './mobile-header.js';

export function initMobileConnect(scroll) {
  const mobile = window.matchMedia(mobileHeroQuery);
  const section = document.querySelector('.connect');
  const composition = section.querySelector('.section-composition');
  const body = section.querySelector('.connect-copy');
  const micro = section.querySelector('.micro-copy');
  const hand = section.querySelector('.hand-reach');
  const surface = section.querySelector('.hand-surface');
  const phone = section.querySelector('.phone-placement');
  const links = [...surface.querySelectorAll('a')];
  const contacts = document.createElement('div');
  contacts.className = 'mobile-contact-group';
  const artwork = document.createElement('div');
  artwork.className = 'mobile-connect-artwork';
  body.after(contacts, artwork);
  function arrange() {
    if (mobile.matches) {
      contacts.append(...links);
      artwork.append(phone, hand);
    } else {
      surface.append(...links);
      composition.insertBefore(phone, micro);
      section.append(hand);
    }
    scroll.refresh();
  }
  mobile.addEventListener('change', arrange);
  arrange();
}
