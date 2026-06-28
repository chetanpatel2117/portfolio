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

  // Contact form submit -> Google Sheets via Apps Script
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const scriptURL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form || !status) return;

    status.textContent = 'Sending...';
    status.className = 'form-status sending';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok && result.status === 'success') {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error(result.message || 'Unable to send message');
      }
    } catch (error) {
      status.textContent = 'Oops! Something went wrong. Please try again.';
      status.className = 'form-status error';
      console.error('Form submit error:', error);
    }
  });
});

// Separate script for contact form submission to Google Sheets via Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbx26EecSOYwdk5Wp2qR2gzNZ0I7V25XTlJc603Ysay_0GOln0cH5Hmc-SDq1q27bbH3/exec";

document.getElementById("contact-form")
.addEventListener("submit", async function(e){
    e.preventDefault();

    const formData = {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value
    };

    const status = document.getElementById("form-status");

    try {
        const response = await fetch(scriptURL, {
            method: "GET",
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if(result.result === "success"){
            status.innerHTML = "Message Sent Successfully!";
            this.reset();
        }
    } catch(error){
        status.innerHTML = "Error sending message!";
    }
});
