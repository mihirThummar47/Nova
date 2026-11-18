// ===== Nova Beauty Parlour =====

// Parlour ka WhatsApp number: country code (91) ke saath, bina + aur space ke
const WHATSAPP_NUMBER = '919999999999';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
  }));

  // Header shadow on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

  // Service tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Package "Book Now" pre-selects the service
  const serviceSelect = document.getElementById('serviceSelect');
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => { serviceSelect.value = btn.dataset.service; });
  });

  // Date: no past dates
  const dateInput = document.getElementById('dateInput');
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().split('T')[0];

  // Booking form -> opens WhatsApp with all details pre-filled
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const ok = field.value.trim() !== '' && field.checkValidity();
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    const email = form.querySelector('[name="email"]');
    if (email.value && !email.checkValidity()) { email.classList.add('invalid'); valid = false; }

    if (!valid) {
      msg.classList.add('error');
      msg.textContent = 'Please fill all required fields correctly.';
      return;
    }

    const get = (name) => form.querySelector(`[name="${name}"]`).value.trim();
    const [y, m, d] = get('date').split('-');
    const lines = [
      '*New Appointment Request - Nova Beauty Parlour*',
      '',
      `Name: ${get('name')}`,
      `Phone: ${get('phone')}`,
      get('email') ? `Email: ${get('email')}` : '',
      `Service: ${get('service')}`,
      `Date: ${d}-${m}-${y}`,
      `Time: ${get('time')}`,
      get('message') ? `Message: ${get('message')}` : ''
    ].filter((line, i) => line !== '' || i === 1);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');

    msg.classList.add('success');
    msg.textContent = 'WhatsApp is opening — please press Send to confirm your booking.';
    form.reset();
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.section-head, .card, .package, .review, .price-list, .about > *, .g-item, .contact-card, .booking > *');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
});
