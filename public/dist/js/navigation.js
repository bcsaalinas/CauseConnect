(() => {
  const header = document.querySelector(".cc-header-glass");
  const skipLink = document.querySelector(".skip-link");

  if (!header) return;

  const toggleScrolled = () => {
    if (window.scrollY > 12) {
      header.classList.add("navbar-scrolled");
    } else {
      header.classList.remove("navbar-scrolled");
    }
  };

  toggleScrolled();
  window.addEventListener("scroll", toggleScrolled, { passive: true });

  if (skipLink) {
    skipLink.addEventListener("focus", () => header.classList.add("skip-active"));
    skipLink.addEventListener("blur", () => header.classList.remove("skip-active"));
  }
})();
