// ===== Nova Beauty Parlour =====
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

  // Booking form (AJAX to book.php)
  const form = document.getElementById('bookingForm');
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', async (e) => {
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

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Booking...';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      msg.classList.add(data.success ? 'success' : 'error');
      msg.textContent = data.message;
      if (data.success) form.reset();
    } catch (err) {
      msg.classList.add('error');
      msg.textContent = 'Something went wrong. Please call or WhatsApp us.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Book Appointment';
    }
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
