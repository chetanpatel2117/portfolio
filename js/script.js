
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
      link.classList.toggle('active', linkId === currentId);
    });
  }

  updateActiveNav();

  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        document.querySelector('.nav-links')?.classList.remove('open');
        document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');
        document.querySelector('.nav-toggle')?.setAttribute('aria-label', 'Open navigation');
      }
    });
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    const isOpen = navLinksEl?.classList.toggle('open') ?? false;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  window.addEventListener('scroll', () => {
    updateActiveNav();
    header?.classList.toggle('sticky', window.scrollY > 8);
  }, { passive: true });

  const currentYear = document.querySelector('#current-year');
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

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

  document.querySelectorAll('[data-project]').forEach((button) => {
    button.addEventListener('click', () => {
      const project = projectData[button.dataset.project];
      if (!project || !projectModal || !projectTitle || !projectSubtitle || !projectBody || !projectClose) {
        console.error(`Unable to open project details for "${button.dataset.project}".`);
        return;
      }

      projectTitle.textContent = project.title;
      projectSubtitle.textContent = project.subtitle;
      projectBody.innerHTML = project.body;
      lastProjectTrigger = button;
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
    if (event.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')) {
      closeProjectModal();
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