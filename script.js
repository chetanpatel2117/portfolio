
//backgound animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
const particles = [];
const particleCount = 80;
const maxDistance = 120;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
    this.opacity = Math.random() * 0.5 + 0.3;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 150, 255, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < maxDistance) {
        const opacity = (1 - dist / maxDistance) * 0.2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  drawLines();
  requestAnimationFrame(animate);
}

animate();

document.addEventListener('DOMContentLoaded', () => {
 
  // --- Reveal on scroll ---
  const sections = document.querySelectorAll('section, .experience');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const items = entry.target.querySelectorAll('h2, p, .skill-card, .skill-item, .project-card, .project-item, .contact-form, .form-group, .form-status');
        items.forEach((el, i) => {
          el.classList.add('reveal-item');
          el.style.transitionDelay = `${i * 100}ms`;
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  sections.forEach(s => observer.observe(s));

  // --- Navigation helpers ---
  const header = document.querySelector('header') || document.querySelector('.header');
  const headerHeight = () => header ? header.offsetHeight : 0;
  const navLinks = document.querySelectorAll('.nav-links a, header nav a');

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

  // typed text animation
  const typedTextEl = document.getElementById('typed-text');
  const typedStrings = ["Full Stack Web Developer", "UI/UX Designer", "Problem Solver"];
  let typedIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    if (!typedTextEl) return;

    const currentString = typedStrings[typedIndex];
    if (isDeleting) {
      typedTextEl.textContent = currentString.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        typedIndex = (typedIndex + 1) % typedStrings.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, 50);
      }
    } else {
      typedTextEl.textContent = currentString.substring(0, charIndex++);
      if (charIndex > currentString.length) {
        isDeleting = true;
        setTimeout(type, 1000);
      } else {
        setTimeout(type, 100);
      }
    }
  }

  type(); 
  // Smooth scroll for anchor links
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        navLinks.forEach(link => link.classList.remove('active'));
        a.classList.add('active');

        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 8;
          window.scrollTo({ top, behavior: 'smooth' });
          setTimeout(updateActiveNav, 300);
        }
        document.querySelector('.nav-links')?.classList.remove('open');
      }
    });
  });

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => navLinksEl?.classList.toggle('open'));

  // Sticky header + highlight while scrolling
  window.addEventListener('scroll', () => {
    updateActiveNav();
    const headerEl = document.querySelector('.header') || header;
    headerEl?.classList.toggle('sticky', window.scrollY > 80);
  }, { passive: true });

  // --- Contact form submission using EmailJS ---
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');

  if (contactForm && formStatus) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS library not loaded. Check CDN in HTML.');
      formStatus.textContent = 'Email service not ready. Refresh page.';
      formStatus.className = 'form-status error';
      return;
    }

    // Initialize EmailJS
    try {
      emailjs.init({
        publicKey: 'P4F5msFDBUeTQft1k',
      });
      console.log('✓ EmailJS initialized successfully');
    } catch (error) {
      console.error('EmailJS init error:', error);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.textContent = 'Sending...';
      formStatus.className = 'form-status sending';

      console.log('Form submitted with data:', {
        name: this.name?.value,
        email: this.email?.value,
        message: this.message?.value,
      });

      emailjs
        .sendForm('service_uv1rh74', 'template_5ocmmhm', this)
        .then((response) => {
          console.log('✓ Message sent successfully!', response);
          formStatus.textContent = 'Message sent successfully!';
          formStatus.className = 'form-status success';
          contactForm.reset();
          // Clear success message after 5 seconds
          setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = '';
          }, 5000);
        })
        .catch((error) => {
          console.error('❌ EmailJS Error Details:', {
            status: error.status,
            text: error.text,
            message: error.message,
            full: error,
          });
          
          let errorMsg = 'Failed to send message. ';
          if (error.status === 0) {
            errorMsg += 'Check your internet connection.';
          } else if (error.status === 400) {
            errorMsg += 'Invalid form data or template.';
          } else if (error.status === 401) {
            errorMsg += 'Authentication failed. Check EmailJS credentials.';
          } else if (error.status === 403) {
            errorMsg += 'Service blocked. Check account limits.';
          } else {
            errorMsg += 'Try again later. (Error: ' + error.status + ')';
          }
          
          formStatus.textContent = errorMsg;
          formStatus.className = 'form-status error';
        });
    });
  } else {
    console.error('Contact form or status element not found');
  }
});

const projectData = {
  hospital: {
    title: 'Hospital Management System',
    subtitle: 'Full-stack hospital management platform with secure patient, appointment, and billing workflows.',
    body: `
      <h3>Project Overview</h3>
      <p>The Hospital Management System is a full-stack web application developed to simplify and automate hospital operations. It provides a centralized platform for managing patients, doctors, appointments, medical records, laboratory reports, pharmacy services, billing, and administrative tasks.</p>
      <p>The system reduces manual paperwork, improves efficiency, and ensures secure management of hospital data through an intuitive dashboard.</p>
      <h3>Problem Statement</h3>
      <p>Traditional hospital management often relies on manual record-keeping, leading to delays, data redundancy, and inefficient communication between departments. This project addresses these challenges by providing a digital solution that streamlines hospital workflows and improves patient care.</p>
      <h3>Objective</h3>
      <p>To develop a secure and user-friendly hospital management platform that enables efficient management of hospital operations while reducing paperwork and enhancing productivity.</p>
      <h3>Features</h3>
      <ul>
        <li>Secure Login & Authentication</li>
        <li>Dashboard with Hospital Statistics</li>
        <li>Patient Registration & Profile Management</li>
        <li>Doctor Management</li>
        <li>Appointment Scheduling</li>
        <li>Electronic Medical Records</li>
        <li>Laboratory Test Management</li>
        <li>Pharmacy Management</li>
        <li>Billing & Invoice Generation</li>
        <li>Staff Management</li>
        <li>Reports & Analytics</li>
        <li>Search & Filter Functionality</li>
        <li>Responsive Design</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, Tailwind CSS, JavaScript, Node.js, Express.js, MongoDB, Git & GitHub</p>
      <h3>My Contribution</h3>
      <p>Designed and developed the complete application, including the user interface, backend functionality, database structure, authentication system, and all core modules. Implemented CRUD operations, appointment scheduling, billing, patient records, laboratory and pharmacy management, and integrated a MySQL database to ensure secure and efficient data management.</p>
      <h3>Key Highlights</h3>
      <ul>
        <li>Responsive and modern dashboard interface</li>
        <li>Secure role-based authentication</li>
        <li>Dynamic database integration</li>
        <li>Automated appointment and billing management</li>
        <li>Organized and scalable code structure</li>
        <li>Improved hospital workflow through digital automation</li>
      </ul>
      <h3>Outcome</h3>
      <p>The Hospital Management System successfully digitizes hospital operations, providing a centralized and efficient platform for healthcare management. It improves administrative efficiency, minimizes manual errors, enhances patient record management, and delivers a seamless experience for hospital staff and patients.</p>
    `,
  },
  recommendation: {
    title: 'Smart Recommendation System',
    subtitle: 'AI-powered recommendation engine for real-time personalized suggestions.',
    body: `
      <h3>Project Overview</h3>
      <p>The Smart Recommendation System is an AI-powered web application that provides personalized recommendations based on user preferences, behavior, and historical data. By leveraging machine learning algorithms and intelligent data analysis, the system delivers accurate, relevant, and real-time suggestions, enhancing user experience and decision-making.</p>
      <h3>Problem Statement</h3>
      <p>Users often struggle to find the most relevant products, services, or content due to the overwhelming amount of available information. Traditional search methods do not consider individual preferences, resulting in less personalized experiences.</p>
      <h3>Objective</h3>
      <p>To develop an intelligent recommendation platform that analyzes user behavior and preferences to provide personalized suggestions using machine learning techniques.</p>
      <h3>Features</h3>
      <ul>
        <li>User Registration & Secure Login</li>
        <li>Personalized Recommendations</li>
        <li>AI-Based Suggestion Engine</li>
        <li>User Preference Analysis</li>
        <li>Search & Filter Functionality</li>
        <li>Recommendation History</li>
        <li>Real-Time Suggestions</li>
        <li>Data Visualization & Analytics</li>
        <li>User Feedback System</li>
        <li>Secure Database Management</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, JavaScript, php, MySQL, Git & GitHub</p>
      <h3>My Contribution</h3>
      <p>Designed and developed the complete Smart Recommendation System, including the frontend interface, backend logic, machine learning model integration, database management, and recommendation engine. Implemented personalized suggestion algorithms, user authentication, data preprocessing, model training, and an interactive dashboard for efficient recommendation management.</p>
      <h3>Key Highlights</h3>
      <ul>
        <li>AI-powered recommendation engine</li>
        <li>Personalized user experience</li>
        <li>Machine learning-based predictions</li>
        <li>Clean and responsive user interface</li>
        <li>Secure authentication system</li>
        <li>Real-time recommendation generation</li>
        <li>Efficient database management</li>
        <li>Scalable and modular architecture</li>
      </ul>
      <h3>Outcome</h3>
      <p>The Smart Recommendation System successfully delivers intelligent and personalized recommendations by analyzing user preferences and behavior. It improves user engagement, enhances decision-making, and provides a seamless experience through accurate, data-driven suggestions, making it suitable for applications such as e-commerce, healthcare, education, entertainment, and travel.</p>
    `,
  },
  waste: {
    title: 'Waste Analysis System Portal',
    subtitle: 'Smart waste analytics portal for monitoring, classification, and reporting.',
    body: `
      <h3>Project Overview</h3>
      <p>The Waste Analysis System Portal is a smart web-based application designed to monitor, analyze, and manage waste data efficiently. The portal helps organizations, municipalities, and industries track waste generation, classify waste types, generate analytical reports, and support environmentally sustainable waste management practices through a centralized digital platform.</p>
      <h3>Problem Statement</h3>
      <p>Manual waste management processes often result in inaccurate data, poor tracking, and inefficient resource utilization. There is a need for a digital system that can organize waste information, analyze trends, and support informed decision-making for better waste management.</p>
      <h3>Objective</h3>
      <p>To develop an intelligent waste analysis platform that enables users to record, monitor, analyze, and visualize waste data while promoting efficient waste management and environmental sustainability.</p>
      <h3>Features</h3>
      <ul>
        <li>Secure User Login & Authentication</li>
        <li>Dashboard with Waste Statistics</li>
        <li>Waste Data Collection & Management</li>
        <li>Waste Classification (Organic, Plastic, Metal, Paper, E-Waste, etc.)</li>
        <li>Daily, Weekly & Monthly Reports</li>
        <li>Interactive Charts & Analytics</li>
        <li>Search & Filter Records</li>
        <li>Waste Trend Analysis</li>
        <li>User & Admin Management</li>
        <li>Data Export (PDF/Excel)</li>
        <li>Responsive User Interface</li>
        <li>Real-Time Dashboard</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, Tailwind CSS, JavaScript, PHP, MySQL, Chart.js, XAMPP, Git & GitHub</p>
      <h3>My Contribution</h3>
      <p>Designed and developed the complete Waste Analysis System Portal, including the responsive frontend, backend functionality, database design, authentication system, waste data management modules, analytical dashboard, and report generation. Implemented CRUD operations, interactive charts, filtering, and secure database integration to provide efficient waste monitoring and analysis.</p>
      <h3>Key Highlights</h3>
      <ul>
        <li>Modern and responsive dashboard</li>
        <li>Interactive data visualization using charts</li>
        <li>Secure authentication and role-based access</li>
        <li>Efficient waste categorization and tracking</li>
        <li>Automated report generation</li>
        <li>Real-time analytics and insights</li>
        <li>Scalable and user-friendly interface</li>
        <li>Centralized waste management database</li>
      </ul>
      <h3>Outcome</h3>
      <p>The Waste Analysis System Portal provides an efficient digital solution for recording, monitoring, and analyzing waste data. By offering real-time analytics, visual reports, and centralized management, the system helps organizations improve waste handling, optimize resource utilization, reduce environmental impact, and support sustainable waste management practices.</p>
    `,
  },
  propertyhunt: {
    title: 'Property Hunt',
    subtitle: 'Modern real estate platform for searching, listing, and managing properties.',
    body: `
      <h3>Project Overview</h3>
      <p>The Property Hunt Website is a modern real estate web application that connects buyers, sellers, tenants, and property owners on a single platform. It allows users to search, buy, sell, or rent residential and commercial properties through an intuitive and responsive interface. The platform simplifies property discovery by providing advanced search filters, detailed property listings, and secure inquiry management.</p>
      <h3>Problem Statement</h3>
      <p>Finding the right property through traditional methods can be time-consuming and inefficient. Buyers often struggle to compare multiple properties, while property owners need a reliable platform to showcase their listings. This project addresses these challenges by providing a centralized and user-friendly property management solution.</p>
      <h3>Objective</h3>
      <p>To develop a secure and responsive real estate platform that enables users to easily search, list, and manage properties while providing a seamless experience for buyers, sellers, and agents.</p>
      <h3>Features</h3>
      <ul>
        <li>User Registration & Secure Login</li>
        <li>Property Listing Management</li>
        <li>Buy, Sell & Rent Properties</li>
        <li>Advanced Property Search & Filters</li>
        <li>Property Categories (Apartment, Villa, House, Commercial, Land)</li>
        <li>Property Details with Images</li>
        <li>Location-Based Search</li>
        <li>Price Range Filter</li>
        <li>Favorite/Wishlist Properties</li>
        <li>Contact Property Owner</li>
        <li>Admin Dashboard</li>
        <li>Agent & User Management</li>
        <li>Responsive Design</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, Tailwind CSS, JavaScript, PHP, MySQL, XAMPP, Git & GitHub</p>
      <h3>My Contribution</h3>
      <p>Designed and developed the complete Property Hunt Website, including the frontend interface, backend functionality, database design, authentication system, property listing management, search filters, inquiry system, and responsive dashboard. Implemented CRUD operations and integrated MySQL for secure and efficient property data management.</p>
      <h3>Key Highlights</h3>
      <ul>
        <li>Modern and responsive UI/UX</li>
        <li>Advanced property search and filtering</li>
        <li>Secure user authentication</li>
        <li>Dynamic property listings</li>
        <li>Image gallery for properties</li>
        <li>Admin dashboard for managing users and listings</li>
        <li>Efficient database integration</li>
        <li>Scalable and user-friendly architecture</li>
      </ul>
      <h3>Outcome</h3>
      <p>The Property Hunt Website provides a complete digital solution for real estate management by simplifying property searching, buying, selling, and renting. The platform enhances user experience through advanced search capabilities, secure management, and responsive design, making property transactions faster, easier, and more efficient.</p>
    `,
  },
  portfolio: {
    title: 'Personal Portfolio Website',
    subtitle: 'Modern responsive portfolio showcasing skills, projects, and professional experience.',
    body: `
      <h3>Project Overview</h3>
      <p>The Personal Portfolio Website is a modern, responsive web application designed to showcase my skills, projects, education, certifications, and professional experience. It serves as my digital portfolio, highlighting my work as a Full Stack Web Developer while providing visitors with an easy way to explore my projects and contact me.</p>
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
        <li>Certifications Section</li>
        <li>Experience Section</li>
        <li>Resume Download</li>
        <li>Contact Form</li>
        <li>Social Media Links</li>
        <li>Smooth Animations & Transitions</li>
        <li>Dark/Light Mode (Optional)</li>
      </ul>
      <h3>Technologies Used</h3>
      <p>HTML, CSS, JavaScript, Git, GitHub</p>
      <h3>My Contribution</h3>
      <p>Designed and developed the complete portfolio website from scratch, including UI/UX design, responsive layouts, interactive components, animations, project showcase, and contact section. Optimized the website for performance, accessibility, and cross-device compatibility while maintaining a clean and professional design.</p>
      <h3>Key Highlights</h3>
      <ul>
        <li>Fully Responsive Across All Devices</li>
        <li>Modern UI/UX Design</li>
        <li>Smooth Scrolling & Animations</li>
        <li>Interactive Project Cards with Detail Modals</li>
        <li>Optimized Performance</li>
        <li>Clean & Maintainable Code</li>
        <li>SEO-Friendly Structure</li>
        <li>Fast Loading Speed</li>
      </ul>
      <h3>Outcome</h3>
      <p>The Personal Portfolio Website successfully presents my professional profile, technical skills, and project experience in an engaging and organized manner. It enhances my online presence, helps recruiters and clients evaluate my work, and serves as a central platform for showcasing my achievements and connecting with potential employers or collaborators.</p>
    `,
  },
};

window.openProjectModal = function openProjectModal(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;
  const modal = document.getElementById('project-modal');
  const titleEl = modal.querySelector('.project-modal-header h2');
  const subtitleEl = modal.querySelector('.project-modal-subtitle');
  const bodyEl = modal.querySelector('.project-modal-body');
  if (!modal || !titleEl || !subtitleEl || !bodyEl) return;
  titleEl.textContent = project.title;
  subtitleEl.textContent = project.subtitle;
  bodyEl.innerHTML = project.body;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeProjectModal = function closeProjectModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

window.openResumeModal = function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeResumeModal = function closeResumeModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};
    

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let particles = [];

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.min(60, Math.floor(width / 24)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.4 + 0.1,
    }));
  }

  function drawBackground() {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(width * 0.25, height * 0.2, 50, width * 0.25, height * 0.2, width * 0.6);
    gradient.addColorStop(0, 'rgba(0, 234, 255, 0.16)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.y -= p.speed;
      if (p.y < -10) p.y = height + 10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 234, 255, ${p.alpha})`;
      ctx.fill();

      for (let i = index + 1; i < particles.length; i += 1) {
        const q = particles[i];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 234, 255, ${0.08 * (1 - dist / 140)})`;
          ctx.stroke();
        }
      }
    });
  }

  function animate() {
    drawBackground();
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();
  window.addEventListener('resize', resizeCanvas, { passive: true });
});