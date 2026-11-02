document.documentElement.classList.remove('no-js');

(function (root, factory) {
  root.EfzeeModel = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const RATE = 300, DEPOSIT = 100;
  const SOURCES = ['Google search', 'Facebook', 'Mudah.com', 'Kenalan'];
  function malaysiaToday(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const get = type => parts.find(part => part.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function dateValue(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return NaN;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? date.getTime() : NaN;
  }
  function nextDay(value) { const time = dateValue(value); return Number.isFinite(time) ? new Date(time + 86400000).toISOString().slice(0, 10) : ''; }
  function nightsBetween(checkin, checkout) { return (dateValue(checkout) - dateValue(checkin)) / 86400000; }
  function count(value, minimum) {
    if (value === '' || value === null || value === undefined) return null;
    const n = Number(value); return Number.isInteger(n) && n >= minimum && n <= 12 ? n : null;
  }
  function quote(values) {
    const adults = count(values.adults, 1), children = count(values.children, 0);
    const guests = adults !== null && children !== null ? adults + children : null;
    const n = nightsBetween(values.checkin, values.checkout), nights = Number.isInteger(n) && n > 0 ? n : null;
    return { adults, children, guests, nights, rate: RATE, deposit: DEPOSIT, stay: nights === null ? null : nights * RATE, total: nights === null ? null : nights * RATE + DEPOSIT };
  }
  function money(value) { return 'RM' + Number(value).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function formatDate(value) { return Number.isFinite(dateValue(value)) ? new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(dateValue(value))) : '-'; }
  function normalizePhone(value) { return String(value || '').trim().replace(/[\s().-]/g, ''); }
  function isValidPhone(value) { return /^\+?\d{7,15}$/.test(normalizePhone(value)); }
  function validateBooking(values, today, requireSource = true) {
    if (!Number.isFinite(dateValue(values.checkin)) || !Number.isFinite(dateValue(values.checkout))) return 'Sila pilih tarikh masuk dan tarikh keluar yang sah.';
    if (today && values.checkin < today) return 'Tarikh masuk tidak boleh sebelum hari ini.';
    if (nightsBetween(values.checkin, values.checkout) < 1) return 'Tarikh keluar mestilah selepas tarikh masuk.';
    const q = quote(values);
    if (q.adults === null) return 'Sila masukkan bilangan dewasa antara 1 hingga 12.';
    if (q.children === null) return 'Sila masukkan bilangan kanak-kanak antara 0 hingga 11.';
    if (q.guests > 12) return 'Jumlah dewasa dan kanak-kanak tidak boleh melebihi 12 tetamu.';
    if (!isValidPhone(values.phoneNumber)) return 'Sila masukkan nombor telefon yang sah, contohnya 012-345 6789 atau +6012-345 6789.';
    if (requireSource && !SOURCES.includes(values.source)) return 'Sila pilih bagaimana anda mengetahui mengenai EfzeeHome.';
    if (values.consentMuslim !== true || values.consentHouseRules !== true) return 'Sila tandakan kedua-dua kotak Perakuan Pelanggan sebelum menghantar pertanyaan.';
    return '';
  }
  function buildInquiry(values) {
    const name = String(values.guestName || '').trim().replace(/[\r\n]+/g, ' ').slice(0, 100), note = String(values.note || '').trim().slice(0, 600), q = quote(values);
    return [
      `Assalamualaikum, saya${name ? ` ${name}` : ''} ingin bertanya tentang penginapan di EfzeeHome.`, '',
      `Nombor telefon pelanggan: ${normalizePhone(values.phoneNumber)}`, '',
      `Tarikh masuk: ${formatDate(values.checkin)}`, `Tarikh keluar: ${formatDate(values.checkout)}`, `Jumlah malam: ${q.nights} malam`,
      `Dewasa: ${q.adults} orang`, `Kanak-kanak: ${q.children} orang`, `Jumlah tetamu: ${q.guests} orang`, '',
      `Kadar: ${money(RATE)}/malam`, `Jumlah penginapan: ${money(q.stay)}`, `Deposit kebersihan dan kerosakan: ${money(DEPOSIT)}`,
      `Jumlah penginapan + deposit: ${money(q.total)}`, 'Deposit RM100 perlu dibayar untuk booking dan akan dikembalikan jika tiada kerosakan.', '',
      `Mengetahui EfzeeHome melalui: ${values.source}`, `Nota / tujuan menginap: ${note || 'Tiada'}`, '',
      'Perakuan Pelanggan:',
      `1) Saya ialah pelanggan Muslim. — ${values.consentMuslim === true ? 'Disahkan' : 'Belum disahkan'}`,
      `2) Saya akan memastikan tiada ahli yang akan merokok atau menggunakan vape di dalam rumah dan tidak akan membawa haiwan peliharaan. — ${values.consentHouseRules === true ? 'Dipersetujui' : 'Belum dipersetujui'}`, '',
      'Mohon semak kekosongan dan sahkan tempahan sebelum saya membuat bayaran. Terima kasih.'
    ].join('\n');
  }
  return { RATE, DEPOSIT, SOURCES, malaysiaToday, dateValue, nextDay, nightsBetween, quote, money, formatDate, normalizePhone, isValidPhone, validateBooking, buildInquiry };
});

(() => {
  'use strict';
  const M = window.EfzeeModel;
  if (typeof document === 'undefined') return;
  const menu = document.querySelector('.menu-toggle'), nav = document.getElementById('main-nav');
  function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && !menu.contains(e.target)) closeMenu(); });
  const id = name => document.getElementById(name);
  const form = id('booking-form'), checkin = id('checkin'), checkout = id('checkout');
  const adults = id('adults'), children = id('children'), error = id('form-error');
  const phone = id('guest-phone');
  const confirmations = [id('consent-muslim'), id('consent-house-rules')];
  const values = () => ({ checkin: checkin.value, checkout: checkout.value, adults: adults.value, children: children.value, source: id('discovery-source').value, guestName: id('guest-name').value, phoneNumber: phone.value, note: id('guest-note').value, consentMuslim: confirmations[0].checked, consentHouseRules: confirmations[1].checked });
  function updatePhoneValidity() {
    phone.setCustomValidity(!phone.value || M.isValidPhone(phone.value) ? '' : 'Sila masukkan nombor telefon yang sah, contohnya 012-345 6789 atau +6012-345 6789.');
    error.hidden = true;
  }
  phone.addEventListener('input', updatePhoneValidity);
  phone.addEventListener('change', updatePhoneValidity);
  confirmations.forEach(input => input.addEventListener('change', () => { error.hidden = true; }));
  checkin.min = M.malaysiaToday(); checkout.min = M.nextDay(M.malaysiaToday());
  function updateSummary() {
    checkout.setCustomValidity(''); adults.setCustomValidity(''); children.setCustomValidity(''); error.hidden = true;
    checkout.min = M.nextDay(checkin.value) || M.nextDay(M.malaysiaToday());
    const q = M.quote(values());
    id('guest-total').textContent = q.guests === null ? '-' : `${q.guests} orang`;
    id('stay-duration').textContent = q.nights === null ? 'Pilih tarikh' : `${q.nights} malam`;
    id('stay-label').textContent = q.nights === null ? 'Penginapan (RM300/malam)' : `Penginapan (${q.nights} malam × RM300)`;
    id('stay-cost').textContent = q.stay === null ? '-' : M.money(q.stay);
    id('stay-total').textContent = q.total === null ? '-' : M.money(q.total);
    if (q.guests !== null && q.guests > 12) {
      const message = 'Jumlah dewasa dan kanak-kanak tidak boleh melebihi 12 tetamu.';
      children.setCustomValidity(message); error.textContent = message; error.hidden = false;
    } else if (checkin.value && checkout.value && M.nightsBetween(checkin.value, checkout.value) < 1) {
      const message = 'Tarikh keluar mestilah selepas tarikh masuk.';
      checkout.setCustomValidity(message); error.textContent = message; error.hidden = false;
    }
  }
  [checkin, checkout, adults, children].forEach(input => { input.addEventListener('input', updateSummary); input.addEventListener('change', updateSummary); });
  checkin.addEventListener('change', () => { if (checkout.value && checkout.value <= checkin.value) checkout.value = M.nextDay(checkin.value); updateSummary(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); const data = values(), message = M.validateBooking(data, M.malaysiaToday());
    if (message) {
      error.textContent = message; error.hidden = false;
      if (!M.isValidPhone(data.phoneNumber)) phone.focus();
      else { const unchecked = confirmations.find(input => !input.checked); if (unchecked) unchecked.focus(); }
      return;
    }
    window.location.assign(`https://wa.me/601163281400?text=${encodeURIComponent(M.buildInquiry(data))}`);
  });
  updateSummary();
  id('copyright-year').textContent = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }).format(new Date());
  const floating = document.querySelector('.mobile-booking');
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => floating.classList.toggle('is-hidden', entries[0].isIntersecting), { rootMargin: '0px 0px -50px 0px', threshold: 0.05 }).observe(document.querySelector('.booking-section'));
})();

(() => {
  'use strict';
  const cards = Array.from(document.querySelectorAll('.gallery-card'));
  const viewer = document.getElementById('photo-viewer');
  // Photo links still open the originals when native dialogs are unavailable.
  if (!cards.length || !viewer || typeof viewer.showModal !== 'function') return;
  const photo = document.getElementById('photo-full');
  const title = document.getElementById('photo-title');
  const count = document.getElementById('photo-count');
  const close = document.getElementById('photo-close');
  let current = 0;
  let opener = null;
  let previousOverflow = '';
  function render(index) {
    current = (index + cards.length) % cards.length;
    const card = cards[current];
    const thumb = card.querySelector('img');
    photo.src = card.getAttribute('href');
    photo.alt = thumb.alt;
    title.textContent = card.dataset.caption;
    count.textContent = `${current + 1} / ${cards.length}`;
  }
  cards.forEach((card, index) => card.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = card;
    render(index);
    previousOverflow = document.body.style.overflow;
    viewer.showModal();
    document.body.style.overflow = 'hidden';
  }));
  close.addEventListener('click', () => viewer.close());
  document.getElementById('photo-prev').addEventListener('click', () => render(current - 1));
  document.getElementById('photo-next').addEventListener('click', () => render(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); render(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); render(current - 1); }
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    if (opener) opener.focus();
  });
})();
