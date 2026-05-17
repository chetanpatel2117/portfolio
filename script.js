document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // Stagger children inside the section for nicer effect
        const items = entry.target.querySelectorAll('h2, p, .skill-card, .service-card, .contact-card, .hero-content, .hero-image');
        items.forEach((el, i) => {
          el.classList.add('reveal-item');
          el.style.transitionDelay = `${i * 100}ms`;
        });

        // run only once: unobserve after first reveal
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(s => observer.observe(s));

  // Update navbar active link based on scroll position
  const navLinks = document.querySelectorAll('.nav-links a');
  function updateActiveNav() {
    let currentId = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
        currentId = sec.id || currentId;
      }
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // Smooth scroll offset for sticky header
  const header = document.querySelector('header');
  const headerHeight = () => header ? header.offsetHeight : 0;
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // close mobile nav if open
        document.querySelector('.nav-links')?.classList.remove('open');
      }
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    navLinksEl?.classList.toggle('open');
  });
});
