/**
 * GlobalGiving API Client
 * Client-side JavaScript for fetching and displaying GlobalGiving projects
 */

const GlobalGivingAPI = {
  baseURL: '/api/gg',

  /**
   * Fetch featured projects summary
   */
  async getFeaturedSummary() {
    try {
      const response = await fetch(`${this.baseURL}/projects/featured/summary`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured summary:', error);
      throw error;
    }
  },

  /**
   * Fetch featured projects
   */
  async getFeaturedProjects() {
    try {
      const response = await fetch(`${this.baseURL}/projects/featured`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }
  },

  /**
   * Search projects by keyword
   */
  async searchProjects(query, filters = {}) {
    try {
      const params = new URLSearchParams({ q: query, ...filters });
      const response = await fetch(`${this.baseURL}/projects/search?${params}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  },

  /**
   * Get projects by country
   */
  async getProjectsByCountry(country) {
    try {
      const response = await fetch(`${this.baseURL}/projects/by-country/${encodeURIComponent(country)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching projects for ${country}:`, error);
      throw error;
    }
  },

  /**
   * Get projects by theme
   */
  async getProjectsByTheme(theme) {
    try {
      const response = await fetch(`${this.baseURL}/projects/by-theme/${encodeURIComponent(theme)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching projects for theme ${theme}:`, error);
      throw error;
    }
  },

  /**
   * Get countries list
   */
  async getCountries() {
    try {
      const response = await fetch(`${this.baseURL}/atlas/countries`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
};

/**
 * UI Helpers for rendering projects
 */
const GlobalGivingUI = {
  /**
   * Create a project card element
   */
  createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'directory-card glass-panel';
    card.setAttribute('data-project-id', project.id);

    const progressPercent = Math.min(project.progress, 100);

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h3 class="h5 mb-0">${this.escapeHtml(project.title)}</h3>
        <span class="badge-soft">${this.escapeHtml(project.theme)}</span>
      </div>
      <p class="text-muted small mb-2">${this.escapeHtml(project.location.country)}</p>
      <p class="flex-grow-1 mb-3">${this.truncate(this.escapeHtml(project.summary), 150)}</p>
      <div class="mb-3">
        <div class="d-flex justify-content-between small text-muted mb-1">
          <span>$${this.formatNumber(project.raised.amount)} raised</span>
          <span>${progressPercent}%</span>
        </div>
        <div class="progress" style="height: 6px;">
          <div class="progress-bar" role="progressbar"
               style="width: ${progressPercent}%; background-color: var(--cc-accent);"
               aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="small text-muted mt-1">Goal: $${this.formatNumber(project.goal.amount)}</div>
      </div>
      <div class="d-flex justify-content-between align-items-center gap-2 mt-auto">
        <a href="${project.url}" target="_blank" rel="noopener"
           class="btn btn-pill btn-sm btn-outline-secondary">View project</a>
        <span class="text-muted small">${project.numberOfDonations} donors</span>
      </div>
    `;

    return card;
  },

  /**
   * Create a skeleton loader card
   */
  createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'directory-card glass-panel skeleton-loader';
    card.innerHTML = `
      <div class="skeleton-header mb-3"></div>
      <div class="skeleton-text mb-2"></div>
      <div class="skeleton-text mb-3"></div>
      <div class="skeleton-progress mb-3"></div>
      <div class="skeleton-footer"></div>
    `;
    return card;
  },

  /**
   * Render projects into a container
   */
  renderProjects(container, projects, options = {}) {
    const { showSkeleton = false, emptyMessage = 'No projects found' } = options;

    // Clear container
    container.innerHTML = '';

    if (showSkeleton) {
      // Show skeleton loaders
      for (let i = 0; i < 6; i++) {
        container.appendChild(this.createSkeletonCard());
      }
      return;
    }

    if (!projects || projects.length === 0) {
      // Show empty state
      const emptyState = document.createElement('div');
      emptyState.className = 'directory-empty glass-panel text-center p-5 fade-up';
      emptyState.innerHTML = `
        <h3 class="h4 mb-3">No matches yet</h3>
        <p class="mb-0">${this.escapeHtml(emptyMessage)}</p>
      `;
      container.appendChild(emptyState);
      return;
    }

    // Render project cards
    projects.forEach(project => {
      container.appendChild(this.createProjectCard(project));
    });
  },

  /**
   * Helper: Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Helper: Truncate text
   */
  truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Helper: Format numbers with commas
   */
  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.GlobalGivingAPI = GlobalGivingAPI;
  window.GlobalGivingUI = GlobalGivingUI;
}
