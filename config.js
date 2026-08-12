/**
 * Config Loader
 * Loads portfolio data from config.json and populates the DOM
 */

async function loadConfig() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();
    populatePortfolio(config);
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

function populatePortfolio(config) {
  // Populate Hero Section
  populateHero(config.personal);

  // Populate About Section
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    aboutText.textContent = config.personal.about;
  }

  // Populate Stats
  populateStats(config.stats);

  // Populate Work Experience
  populateWorkExperience(config.workExperience);

  // Populate Projects
  populateProjects(config.projects);

  // Populate Skills
  populateSkills(config.skills);

  // Populate Contact Section
  populateContact(config.personal);

  // Update social links in floating nav
  updateSocialLinks(config.socialLinks);
}

function populateHero(personal) {
  const h1 = document.querySelector('.hero-text h1');
  const p = document.querySelector('.hero-text p');

  if (h1) h1.textContent = `Hi, I'm ${personal.name}`;
  if (p) p.textContent = personal.tagline;

  // Populate work status
  populateWorkStatus(personal.workStatus);
}

function populateWorkStatus(workStatus) {
  const statusMap = {
    1: {
      text: "Looking for Work",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.4)"
    },
    2: {
      text: "Commissions Open",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.4)"
    },
    3: {
      text: "Not Looking for Work",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.4)"
    }
  };

  const s = statusMap[workStatus] || statusMap[1];
  const container = document.getElementById("statusContainer");

  if (container) {
    container.innerHTML = `
      <div style="
        display:inline-flex;
        align-items:center;
        gap:8px;
        margin-top:16px;
        padding:6px 14px;
        border-radius:999px;
        font-size:0.8rem;
        font-weight:600;
        border:1px solid ${s.border};
        background:${s.bg};
        color:${s.color};
      ">
        <span style="
          width:8px;
          height:8px;
          border-radius:50%;
          background:${s.color};
        "></span>
        <span>${s.text}</span>
      </div>
    `;
  }
}

function populateStats(stats) {
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;

  statsGrid.innerHTML = '';

  stats.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `
      <span class="stat-icon">${stat.icon}</span>
      <div class="stat-value">
        <span class="count" data-target="${stat.value}" data-suffix="${stat.suffix}">0</span>
      </div>
      <div class="stat-label">${stat.label}</div>
    `;
    statsGrid.appendChild(card);
  });

  // Re-observe the stats section for scroll reveal and counting animation
  const statsSection = document.getElementById('stats');
  if (statsSection && observer) {
    observer.unobserve(statsSection);
    observer.observe(statsSection);
  }
}

function populateWorkExperience(workItems) {
  const entryList = document.querySelector('#work .entry-list');
  if (!entryList) return;

  entryList.innerHTML = '';

  workItems.forEach(item => {
    const entry = document.createElement('div');
    entry.className = 'entry';

    const iconHTML = item.isImage
      ? `<img src="${item.icon}" alt="${item.company}" />`
      : item.icon;

    entry.innerHTML = `
      <div class="entry-icon">${iconHTML}</div>
      <div class="entry-body">
        <strong>${item.company}</strong>
        <span class="role">${item.role}</span>
      </div>
      <div class="entry-date">${item.dateRange}</div>
    `;
    entryList.appendChild(entry);
  });
}

function populateProjects(projects) {
  const entryList = document.querySelector('#projects .entry-list');
  if (!entryList) return;

  entryList.innerHTML = '';

  projects.forEach(project => {
    const entry = document.createElement('div');
    entry.className = 'entry project';

    const iconHTML = project.isImage
      ? `<img src="${project.icon}" alt="${project.name}" />`
      : project.icon;

    entry.innerHTML = `
      <div class="entry-icon">${iconHTML}</div>
      <div class="entry-body">
        <strong>${project.name}</strong>
        <span class="proj-desc">${project.description}</span>
        <span class="proj-stack">${project.stack}</span>
      </div>
      <div class="entry-date">${project.dateRange}</div>
    `;
    entryList.appendChild(entry);
  });
}

function populateSkills(skills) {
  const skillList = document.querySelector('.skill-list');
  if (!skillList) return;

  skillList.innerHTML = '';

  skills.forEach(skill => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill';
    pill.innerHTML = `<span class="pill-icon">${skill.icon}</span> ${skill.name}`;
    skillList.appendChild(pill);
  });
}

function populateContact(personal) {
  const contactBox = document.querySelector('.contact-box');
  if (!contactBox) return;

  const p = contactBox.querySelector('p');
  if (p) {
    p.innerHTML = `
      ${personal.contactMessage} <a href="mailto:${personal.email}">${personal.email}</a>
    `;
  }
}

function updateSocialLinks(links) {
  // Update Discord link
  const discordLink = document.querySelector('a[title="Discord"]');
  if (discordLink && links.discord) {
    discordLink.href = links.discord;
  }

  // Update GitHub link
  const githubLink = document.querySelector('a[title="GitHub"]');
  if (githubLink && links.github) {
    githubLink.href = links.github;
  }
}

// Load config when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadConfig);
} else {
  loadConfig();
}
