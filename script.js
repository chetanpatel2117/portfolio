document.addEventListener('DOMContentLoaded', () => {
  // --- Reveal on scroll ---
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const items = entry.target.querySelectorAll('h2, p, .skill-card, .service-card, .contact-card, .hero-content, .hero-image');
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

  // Smooth scroll for anchor links
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
    const top = window.scrollY;
    sections.forEach(sec => {
      const offset = sec.offsetTop - 150;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (id && top >= offset && top < offset + height) {
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href')?.includes(id)));
      }
    });
    const headerEl = document.querySelector('.header') || header;
    headerEl?.classList.toggle('sticky', window.scrollY > 100);
  }, { passive: true });

  // --- Contact form submission (single, consolidated handler) ---
  // Replace YOUR_DEPLOYMENT_ID with your Apps Script deployment id.
  const scriptURL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!form || !status) return;
    status.textContent = 'Sending...';
    status.className = 'form-status sending';

    try {
      // Prefer sending FormData (Apps Script Web Apps often accept form-encoded bodies)
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: new FormData(form),
      });

      // Try to parse JSON, fallback to text
      let resultText = '';
      try { resultText = await response.text(); } catch (e) { resultText = ''; }

      if (response.ok) {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = 'Error sending message.';
        status.className = 'form-status error';
        console.error('Form submit failed:', response.status, resultText);
      }
    } catch (error) {
      status.textContent = 'Oops! Something went wrong. Please try again.';
      status.className = 'form-status error';
      console.error('Form submit error:', error);
    }
  }

  form?.addEventListener('submit', handleFormSubmit);
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
    