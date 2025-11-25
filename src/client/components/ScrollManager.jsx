import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    // Legacy animation trigger - will be replaced by React hooks later
    if (typeof window.initCauseConnectAnimations === "function") {
      window.initCauseConnectAnimations();
    }
  }, [location.pathname, location.hash]);
  return null;
}

export default ScrollManager;
