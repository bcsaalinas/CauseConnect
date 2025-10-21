/**
 * Directory Page - GlobalGiving Projects Integration
 * Handles dynamic search, filtering, and rendering of projects
 */

// State management
const DirectoryState = {
  projects: [],
  filters: {
    q: '',
    country: '',
    theme: ''
  },
  isLoading: false,
  searchTimeout: null
};

// DOM elements
let searchInput;
let countrySelect;
let themeSelect;
let resultsContainer;
let resultsCount;
let filtersContainer;

/**
 * Initialize directory on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  searchInput = document.getElementById('directory-search-gg');
  countrySelect = document.getElementById('directory-country-gg');
  themeSelect = document.getElementById('directory-theme-gg');
  resultsContainer = document.getElementById('gg-directory-results');
  resultsCount = document.getElementById('gg-results-count');
  filtersContainer = document.getElementById('gg-active-filters');

  if (!resultsContainer) return; // Not on directory page

  // Set up event listeners
  setupEventListeners();

  // Load initial projects (Mexico by default)
  loadProjects({ country: 'Mexico' });
});

/**
 * Set up event listeners for search and filters
 */
function setupEventListeners() {
  // Search input with debouncing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Clear existing timeout
      if (DirectoryState.searchTimeout) {
        clearTimeout(DirectoryState.searchTimeout);
      }

      // Debounce search (300ms)
      DirectoryState.searchTimeout = setTimeout(() => {
        DirectoryState.filters.q = query;
        loadProjects(DirectoryState.filters);
      }, 300);
    });
  }

  // Country filter
  if (countrySelect) {
    countrySelect.addEventListener('change', (e) => {
      DirectoryState.filters.country = e.target.value;
      loadProjects(DirectoryState.filters);
    });
  }

  // Theme filter
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      DirectoryState.filters.theme = e.target.value;
      loadProjects(DirectoryState.filters);
    });
  }
}

/**
 * Load projects from API with filters
 */
async function loadProjects(filters = {}) {
  if (DirectoryState.isLoading) return;

  DirectoryState.isLoading = true;

  // Show skeleton loaders
  showSkeletonLoaders();

  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.country) params.append('country', filters.country);
    if (filters.theme) params.append('theme', filters.theme);
    params.append('limit', '50');

    // Fetch projects
    const response = await fetch(`/api/gg/projects/directory?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    DirectoryState.projects = data.projects || [];

    // Update UI
    updateResultsCount(data.total || 0);
    updateActiveFilters(data.filters || {});
    renderProjects(DirectoryState.projects);

  } catch (error) {
    console.error('Error loading projects:', error);
    showError('Unable to load projects. Please try again later.');
  } finally {
    DirectoryState.isLoading = false;
  }
}

/**
 * Show skeleton loaders while loading
 */
function showSkeletonLoaders() {
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '';

  // Create 6 skeleton cards
  for (let i = 0; i < 6; i++) {
    const skeleton = GlobalGivingUI.createSkeletonCard();
    skeleton.style.minHeight = '280px';
    resultsContainer.appendChild(skeleton);
  }
}

/**
 * Render projects to the grid
 */
function renderProjects(projects) {
  if (!resultsContainer) return;

  resultsContainer.innerHTML = '';

  if (!projects || projects.length === 0) {
    // Show empty state
    const emptyState = document.createElement('div');
    emptyState.className = 'directory-empty glass-panel text-center p-5 fade-up';
    emptyState.style.gridColumn = '1 / -1';
    emptyState.innerHTML = `
      <h3 class="h4 mb-3">No projects found</h3>
      <p class="mb-4">Try adjusting your filters or search term to discover more projects.</p>
      <button class="btn btn-pill btn-pill-outline" onclick="resetFilters()">Reset filters</button>
    `;
    resultsContainer.appendChild(emptyState);
    return;
  }

  // Render project cards
  projects.forEach((project, index) => {
    const card = createDirectoryProjectCard(project);
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    resultsContainer.appendChild(card);

    // Stagger animation
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 50);
  });
}

/**
 * Create a project card for directory view
 */
function createDirectoryProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'directory-card glass-panel';
  card.setAttribute('data-project-id', project.id);
  card.setAttribute('role', 'article');
  card.setAttribute('tabindex', '0');

  const progressPercent = Math.min(project.progress, 100);

  card.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-3">
      <h3 class="h5 mb-0">${escapeHtml(project.title)}</h3>
      <span class="badge-soft">${escapeHtml(project.theme)}</span>
    </div>

    <p class="text-muted small mb-2">
      <svg width="14" height="14" fill="currentColor" class="me-1" style="margin-top: -2px;">
        <use href="#icon-location"></use>
      </svg>
      ${escapeHtml(project.location.country)}${project.location.city ? `, ${escapeHtml(project.location.city)}` : ''}
    </p>

    <p class="flex-grow-1 mb-3" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
      ${escapeHtml(project.summary)}
    </p>

    <div class="mb-3">
      <div class="d-flex justify-content-between small text-muted mb-1">
        <span>$${formatNumber(project.raised.amount)} raised</span>
        <span>${progressPercent}%</span>
      </div>
      <div class="progress" style="height: 6px;">
        <div class="progress-bar" role="progressbar"
             style="width: ${progressPercent}%; background-color: var(--cc-accent);"
             aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <div class="small text-muted mt-1">Goal: $${formatNumber(project.goal.amount)}</div>
    </div>

    <div class="d-flex justify-content-between align-items-center gap-2 mt-auto">
      <a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer"
         class="btn btn-pill btn-sm btn-outline-secondary">View project</a>
      <span class="text-muted small">${project.numberOfDonations} donors</span>
    </div>
  `;

  return card;
}

/**
 * Update results count display
 */
function updateResultsCount(count) {
  if (resultsCount) {
    resultsCount.textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  }
}

/**
 * Update active filters display
 */
function updateActiveFilters(filters) {
  if (!filtersContainer) return;

  filtersContainer.innerHTML = '';

  if (filters.country) {
    const badge = document.createElement('span');
    badge.className = 'badge-soft';
    badge.innerHTML = `Country: ${escapeHtml(filters.country)} <button class="ms-1 btn-close btn-close-sm" onclick="removeFilter('country')" aria-label="Remove country filter"></button>`;
    filtersContainer.appendChild(badge);
  }

  if (filters.theme) {
    const badge = document.createElement('span');
    badge.className = 'badge-soft';
    badge.innerHTML = `Theme: ${escapeHtml(filters.theme)} <button class="ms-1 btn-close btn-close-sm" onclick="removeFilter('theme')" aria-label="Remove theme filter"></button>`;
    filtersContainer.appendChild(badge);
  }

  if (filters.q) {
    const badge = document.createElement('span');
    badge.className = 'badge-soft';
    badge.innerHTML = `Search: "${escapeHtml(filters.q)}" <button class="ms-1 btn-close btn-close-sm" onclick="removeFilter('q')" aria-label="Remove search filter"></button>`;
    filtersContainer.appendChild(badge);
  }
}

/**
 * Show error message
 */
function showError(message) {
  if (!resultsContainer) return;

  resultsContainer.innerHTML = `
    <div class="gg-error" style="grid-column: 1 / -1;">
      <p class="mb-0">${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Reset all filters
 */
window.resetFilters = function() {
  DirectoryState.filters = { q: '', country: 'Mexico', theme: '' };

  if (searchInput) searchInput.value = '';
  if (countrySelect) countrySelect.value = 'Mexico';
  if (themeSelect) themeSelect.value = '';

  loadProjects({ country: 'Mexico' });
};

/**
 * Remove a specific filter
 */
window.removeFilter = function(filterName) {
  DirectoryState.filters[filterName] = filterName === 'country' ? 'Mexico' : '';

  if (filterName === 'q' && searchInput) searchInput.value = '';
  if (filterName === 'country' && countrySelect) countrySelect.value = 'Mexico';
  if (filterName === 'theme' && themeSelect) themeSelect.value = '';

  loadProjects(DirectoryState.filters);
};

/**
 * Helper: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Helper: Format numbers with commas
 */
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

// Add location icon SVG sprite (if not already in page)
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('icon-location')) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.display = 'none';
    svg.innerHTML = `
      <symbol id="icon-location" viewBox="0 0 16 16">
        <path d="M8 0a5.5 5.5 0 0 0-5.5 5.5c0 4.5 5.5 10.5 5.5 10.5s5.5-6 5.5-10.5A5.5 5.5 0 0 0 8 0zm0 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </symbol>
    `;
    document.body.insertBefore(svg, document.body.firstChild);
  }
});
