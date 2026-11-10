
document.addEventListener('DOMContentLoaded', () => {
 
  const sections = document.querySelectorAll('main section, body > section');
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const top = window.scrollY + 160;
    let currentId = '';

    sections.forEach(sec => {
      const offset = sec.offsetTop;
      const height = sec.offsetHeight;
      if (top >= offset && top < offset + height) {
        currentId = sec.id || '';
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkId = href?.startsWith('#') ? href.slice(1) : '';
      const isActive = linkId === currentId;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  updateActiveNav();

  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');

  function setNavigationOpen(isOpen) {
    navLinksEl?.classList.toggle('open', isOpen);
    navToggle?.setAttribute('aria-expanded', String(isOpen));
    navToggle?.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    const icon = navToggle?.querySelector('i');
    icon?.classList.toggle('fa-bars', !isOpen);
    icon?.classList.toggle('fa-xmark', isOpen);
  }

  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        setNavigationOpen(false);
      }
    });
  });

  navToggle?.addEventListener('click', () => {
    setNavigationOpen(!navLinksEl?.classList.contains('open'));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinksEl?.classList.contains('open')) {
      setNavigationOpen(false);
      navToggle?.focus();
    }
  });

  window.addEventListener('scroll', () => {
    updateActiveNav();
    header?.classList.toggle('sticky', window.scrollY > 8);
  }, { passive: true });

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealTargets = new Set(document.querySelectorAll('main section, footer'));
    const revealItems = document.querySelectorAll(
      '.hero-content, .hero-image, .about-container, .about-text, .info-boxes > *, .skills-grid > *, .services-grid > *, .projects-grid > *, .timeline > *, .contact-grid > *, .contact-form',
    );

    revealItems.forEach((element, index) => {
      element.classList.add('scroll-reveal-item');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
      revealTargets.add(element);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -6% 0px',
    });

    revealTargets.forEach((element) => {
      element.classList.add('scroll-reveal');
      revealObserver.observe(element);
    });
  }

  const skillsSection = document.querySelector('.skills');
  if (skillsSection && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    skillsSection.addEventListener('pointermove', (event) => {
      const sectionBounds = skillsSection.getBoundingClientRect();
      skillsSection.style.setProperty('--mouse-x', `${event.clientX - sectionBounds.left}px`);
      skillsSection.style.setProperty('--mouse-y', `${event.clientY - sectionBounds.top}px`);
      skillsSection.style.setProperty('--spotlight-opacity', '1');

      const card = event.target.closest('.skill-card');
      if (!card || !skillsSection.contains(card)) return;

      const cardBounds = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - cardBounds.left}px`);
      card.style.setProperty('--y', `${event.clientY - cardBounds.top}px`);
    });

    skillsSection.addEventListener('pointerleave', () => {
      skillsSection.style.setProperty('--spotlight-opacity', '0');
    });
  }

  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = contactForm?.querySelector('button[type="submit"]');

  if (contactForm && formStatus) {
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS library is unavailable. The contact form cannot send messages.');
      formStatus.textContent = 'The message service is unavailable. Please email me directly.';
      formStatus.className = 'form-status error';
    } else {
      emailjs.init({
        publicKey: 'P4F5msFDBUeTQft1k',
      });

      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formStatus.textContent = 'Sending your message…';
        formStatus.className = 'form-status';
        if (submitButton) submitButton.disabled = true;

        try {
          await emailjs.sendForm('service_1rle7ho', 'template_5ocmmhm', contactForm);
          formStatus.textContent = 'Message sent successfully!';
          formStatus.className = 'form-status success';
          contactForm.reset();
        } catch (error) {
          console.error('EmailJS could not send the contact message:', error);
          formStatus.textContent = 'Message could not be sent. Please email me directly or try again later.';
          formStatus.className = 'form-status error';
        } finally {
          if (submitButton) submitButton.disabled = false;
        }
      });
    }
  } else {
    console.error('Contact form initialization failed: form or status element is missing.');
  }
});

const projectData = {
  hospital: {
    title: 'Hospital Management System',
    subtitle: 'A web app for organizing patient records and appointments.',
    body: `
      <h3>Project summary</h3>
      <p>A web-based system for organizing patient records and appointments.</p>
      <h3>Features</h3>
      <ul>
        <li>Patient records and profiles</li>
        <li>Appointment Scheduling</li>
        <li>Responsive web interface</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, JavaScript, PHP, MySQL</p>
      <h3>My Contribution</h3>
      <p>Developed the interface and patient and appointment workflows.</p>
    `,
  },
  recommendation: {
    title: 'Smart Recommendation System',
    subtitle: 'A web application that presents suggestions based on user preferences.',
    body: `
      <h3>Project summary</h3>
      <p>A web application that presents suggestions based on user preferences.</p>
      <h3>Features</h3>
      <ul>
        <li>User preference input</li>
        <li>Personalized recommendations</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, JavaScript, PHP, MySQL</p>
      <h3>My Contribution</h3>
      <p>Built the web interface and recommendation flow.</p>
    `,
  },
  waste: {
    title: 'Waste Analysis Portal',
    subtitle: 'A web portal for monitoring and analyzing waste data.',
    body: `
      <h3>Project summary</h3>
      <p>A web portal for monitoring and analyzing waste-management data, with reporting tools to help review the information.</p>
      <h3>Features</h3>
      <ul>
        <li>Waste data monitoring</li>
        <li>Analysis and reporting</li>
      </ul>
    `,
  },
  propertyhunt: {
    title: 'Property Hunt',
    subtitle: 'A real-estate website for searching property listings.',
    body: `
      <h3>Project summary</h3>
      <p>A real-estate property listing website with search and detailed property information.</p>
      <h3>Features</h3>
      <ul>
        <li>Property search</li>
        <li>Detailed property information</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>PHP, MySQL</p>
      <h3>My Contribution</h3>
      <p>Created the website with property search and detail pages backed by PHP and MySQL.</p>
    `,
  },
  portfolio: {
    title: 'Personal Portfolio Website',
    subtitle: 'Modern responsive portfolio showcasing skills, projects, and professional experience.',
    body: `
      <h3>Project Overview</h3>
      <p>This responsive website introduces my background, technical skills, projects, education, internship experience, and contact information.</p>
      <h3>Problem Statement</h3>
      <p>A traditional resume provides limited information about a developer's skills and projects. A portfolio website offers a professional online presence where recruiters, clients, and employers can view projects, technical expertise, and achievements in an interactive and visually appealing format.</p>
      <h3>Objective</h3>
      <p>To create a responsive and user-friendly portfolio website that effectively showcases my technical skills, project experience, achievements, and contact information while strengthening my professional online presence.</p>
      <h3>Features</h3>
      <ul>
        <li>Responsive Modern Design</li>
        <li>Interactive Hero Section</li>
        <li>About Me Section</li>
        <li>Skills & Technologies</li>
        <li>Projects Showcase</li>
        <li>Project Detail Popups</li>
        <li>Education Timeline</li>
        <li>Experience Section</li>
        <li>Resume Download</li>
        <li>Contact Form</li>
        <li>Social Media Links</li>
        <li>Smooth Animations & Transitions</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, JavaScript, Git, GitHub</p>
      <h3>My Contribution</h3>
      <p>Built the page structure, responsive styling, project gallery, navigation, and contact section using HTML, CSS, and JavaScript.</p>
    `,
  },
  fleetdash: {
    title: 'FleetDash',
    subtitle: 'Real-Time Fleet Management System',
    body: `
      <h3>Project overview</h3>
      <p>A fleet management platform for monitoring vehicles, telemetry, geofences, and fleet activity through an interactive dashboard.</p>
      <h3>Key features</h3>
      <ul>
        <li>Real-time vehicle location and fleet monitoring</li>
        <li>Vehicle telemetry and performance data</li>
        <li>Interactive map and geofence entry/exit monitoring</li>
        <li>Fleet analytics and real-time vehicle alerts</li>
      </ul>
      <h3>Technology stack</h3>
      <p>React.js, TypeScript, Node.js, Express.js, MongoDB, Redis, Socket.IO, Worker Threads, Canvas API, and Turf.js</p>
      <h3>My role and contributions</h3>
      <ul>
        <li>Served as team leader and contributed to backend architecture.</li>
        <li>Handled initial project setup, backend structure, API development, and database integration.</li>
        <li>Coordinated frontend/backend integration and collaborated on development and testing.</li>
      </ul>
      <h3>Project objective</h3>
      <p>Help businesses track vehicles, monitor performance, improve operational visibility, and manage fleet activity in real time.</p>
      <p><strong>Project type:</strong> Full-stack web application<br><strong>Domain:</strong> Fleet management and real-time tracking</p>
    `,
  },
  ledgerguard: {
    title: 'LedgerGuard',
    subtitle: 'Dynamic Multi-Tenant Zero-Knowledge Billing Engine',
    body: `
      <h3>Project overview</h3>
      <p>A multi-tenant billing management platform for organizations to manage billing and resource usage, with a focus on data isolation, secure authentication, reliable transactions, and duplicate payment prevention.</p>
      <h3>Key features</h3>
      <ul>
        <li>JWT-based login and registration</li>
        <li>Organization-level multi-tenant data isolation</li>
        <li>Dynamic database connection management</li>
        <li>Redis-based distributed locking</li>
        <li>MongoDB transaction management</li>
        <li>Real-time usage and cost analytics</li>
        <li>Billing ledger and transaction history</li>
      </ul>
      <h3>Technology stack</h3>
      <p>React.js, TypeScript, Chart.js, Node.js, Express.js, MongoDB, Mongoose, Redis, and JWT.</p>
      <h3>My role and contributions</h3>
      <ul>
        <li>Contributed to project architecture and initial setup.</li>
        <li>Developed frontend and backend modules and integrated authentication and database functionality.</li>
        <li>Worked on the dashboard and billing ledger, and contributed to module integration and testing.</li>
      </ul>
      <h3>Project objective</h3>
      <p>Develop a reliable billing platform that supports organization-level data isolation, secure operations, and consistent transaction processing.</p>
      <p><strong>Project type:</strong> Full-stack web application<br><strong>Domain:</strong> FinTech and multi-tenant SaaS</p>
    `,
  },
};

window.addEventListener('DOMContentLoaded', () => {
  const projectModal = document.getElementById('project-modal');
  const projectTitle = projectModal?.querySelector('.project-modal-header h2');
  const projectSubtitle = projectModal?.querySelector('.project-modal-subtitle');
  const projectBody = projectModal?.querySelector('.project-modal-body');
  const projectClose = projectModal?.querySelector('.project-modal-close');
  let lastProjectTrigger;

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    lastProjectTrigger?.focus();
  }

  document.querySelectorAll('[data-project]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const project = projectData[trigger.dataset.project];
      if (!project || !projectModal || !projectTitle || !projectSubtitle || !projectBody || !projectClose) {
        console.error(`Unable to open project details for "${trigger.dataset.project}".`);
        return;
      }

      projectTitle.textContent = project.title;
      projectSubtitle.textContent = project.subtitle;
      projectBody.innerHTML = project.body;
      lastProjectTrigger = trigger;
      projectModal.classList.remove('hidden');
      document.body.classList.add('modal-open');
      projectClose.focus();
    });
  });

  projectClose?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (event) => {
    if (event.target === projectModal) closeProjectModal();
  });
  document.addEventListener('keydown', (event) => {
    if (!projectModal || projectModal.classList.contains('hidden')) return;

    if (event.key === 'Escape') {
      closeProjectModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = projectModal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
      } else if (!projectModal.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  const canvas = document.getElementById('bg-canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame;

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const particleCount = Math.min(60, Math.floor(width / 24));
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.25 + 0.08,
    }));
  }

  function drawBackground() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      if (particle.y < -10) particle.y = height + 10;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(110, 231, 210, ${particle.opacity})`;
      context.fill();

      for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
        const nextParticle = particles[nextIndex];
        const distance = Math.hypot(particle.x - nextParticle.x, particle.y - nextParticle.y);
        if (distance >= 140) continue;

        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(nextParticle.x, nextParticle.y);
        context.strokeStyle = `rgba(110, 231, 210, ${0.06 * (1 - distance / 140)})`;
        context.stroke();
      }
    });
  }

  function animate() {
    if (document.hidden) return;
    drawBackground();
    animationFrame = window.requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animate();
    }
  });

});