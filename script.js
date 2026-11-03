/* ============================================
   GLOW STUDIO — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Header scroll state ----------
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    const closeMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }
  // ---------- 3D tilt on cards ----------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!prefersReduced && !isTouch) {
    const tiltCards = document.querySelectorAll('.service-card, .hero-image');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---------- Parallax on hero image ----------
  if (!prefersReduced) {
    const heroImg = document.querySelector('.hero-image img');
    window.addEventListener('scroll', () => {
      if (!heroImg) return;
      const y = window.scrollY;
      if (y < window.innerHeight) {
        const offset = Math.min(y * 0.08, 30);
        heroImg.style.transform = `translateY(${offset}px) scale(1.12)`;
      } else {
        heroImg.style.transform = '';
      }
    }, { passive: true });
  }

  // ---------- Back to top ----------
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Appointment form validation ----------
  const form = document.getElementById('appointment-form');
  if (form) {
    const fields = {
      name: { el: form.querySelector('#name'), msg: 'Please enter your name.' },
      phone: { el: form.querySelector('#phone'), msg: 'Please enter a valid phone number.' },
      service: { el: form.querySelector('#service'), msg: 'Please select a service.' },
      date: { el: form.querySelector('#date'), msg: 'Please choose a preferred date.' },
    };
    const formMessage = document.getElementById('form-message');

    function showError(key, show, custom) {
      const group = fields[key].el.closest('.form-group');
      const err = group.querySelector('.form-error');
      if (show) {
        group.classList.add('error');
        err.textContent = custom || fields[key].msg;
      } else {
        group.classList.remove('error');
      }
    }

    function validate() {
      let ok = true;
      if (!fields.name.el.value.trim()) { showError('name', true); ok = false; }
      else showError('name', false);

      const phoneVal = fields.phone.el.value.trim();
      if (!/^[0-9+\-\s()]{7,}$/.test(phoneVal)) { showError('phone', true); ok = false; }
      else showError('phone', false);

      if (!fields.service.el.value) { showError('service', true); ok = false; }
      else showError('service', false);

      const dateVal = fields.date.el.value;
      if (!dateVal) { showError('date', true); ok = false; }
      else {
        const now = new Date();
        const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (dateVal < localToday) { showError('date', true, 'Please choose a future date.'); ok = false; }
        else showError('date', false);
      }
      return ok;
    }

    Object.keys(fields).forEach(k => {
      fields[k].el.addEventListener('blur', validate);
      fields[k].el.addEventListener('input', () => {
        const group = fields[k].el.closest('.form-group');
        if (group.classList.contains('error')) validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      if (formMessage) {
        formMessage.className = 'form-message show info';
        formMessage.innerHTML = '<strong>Demonstration only.</strong> This form does not send a real booking. ' +
          'In a live site, your enquiry would be forwarded to the salon. ' +
          'For now, please use the WhatsApp link below to reach us.';
      }
      form.reset();
      if (formMessage) formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ---------- Image fallback ----------
  document.querySelectorAll('img').forEach(img => {
    const fallback = () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback = '1';
        img.src = 'assets/placeholder.svg';
      }
    };
    img.addEventListener('error', fallback);
    // Catch images that already failed before this handler was attached
    if (img.complete && img.naturalWidth === 0) fallback();
  });

  // ---------- Set min date for appointment ----------
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

});
