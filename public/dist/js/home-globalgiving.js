/**
 * Load featured GlobalGiving projects on home page
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gg-featured-projects');
  if (!container) return;

  // Load featured projects
  loadFeaturedProjects();

  async function loadFeaturedProjects() {
    try {
      const data = await GlobalGivingAPI.getFeaturedProjects();

      // Limit to first 6 projects for the home page
      const projects = data.projects.slice(0, 6);

      // Render projects
      GlobalGivingUI.renderProjects(container, projects, {
        emptyMessage: 'No featured projects available at the moment.'
      });

    } catch (error) {
      console.error('Failed to load featured projects:', error);

      // Show error state
      container.innerHTML = `
        <div class="gg-error" style="width: 100%;">
          <p class="mb-0">Unable to load projects. Please try again later.</p>
        </div>
      `;
    }
  }
});
