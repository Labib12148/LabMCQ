// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Try scrolling window first (default behavior)
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // Also scroll main content if you have a container
    const main = document.querySelector("main");
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
