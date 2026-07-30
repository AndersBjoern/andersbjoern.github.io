// About Me GSAP Scroll Animations
function initAboutMeAnimations() {
  // Check if GSAP and ScrollTrigger are available
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger not loaded");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Get all about chunks
  const chunks = document.querySelectorAll(".about-chunk");

  if (chunks.length === 0) {
    return;
  }

  // Animate each chunk on scroll
  chunks.forEach((chunk, index) => {
    gsap.to(chunk, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: chunk,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none none",
      },
    });

    // Special animation for chunk-center images
    if (chunk.classList.contains("chunk-center")) {
      const logos = chunk.querySelectorAll(".chunk-logos img");
      logos.forEach((logo, i) => {
        gsap.from(logo, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.3 + i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: chunk,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
    }

    // Animate alternating chunks with slide-in effects
    if (chunk.classList.contains("chunk-alternating")) {
      const media = chunk.querySelector(".chunk-media");
      const content = chunk.querySelector(".chunk-content");

      // Determine slide direction based on layout
      const isReverse = chunk.classList.contains("chunk-reverse");
      const mediaDirection = isReverse ? -30 : 30;
      const contentDirection = isReverse ? 30 : -30;

      gsap.from(media, {
        x: mediaDirection,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chunk,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(content, {
        x: contentDirection,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: chunk,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  // Animate certifications section
  const certifications = document.querySelector(".certifications");
  if (certifications) {
    gsap.from(certifications, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: certifications,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }
}

// Initialize animations when sections are loaded
window.addEventListener("sectionsLoaded", () => {
  // Add a small delay to ensure DOM is fully ready
  setTimeout(initAboutMeAnimations, 100);
});

// Also try to initialize on DOMContentLoaded as fallback
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initAboutMeAnimations, 100);
  });
} else {
  setTimeout(initAboutMeAnimations, 100);
}

// Certificate Show More Button Functionality
function initCertificateToggle() {
  const showMoreBtn = document.querySelector(".show-more-btn");
  const certContainer = document.querySelector(".cert-container");

  if (showMoreBtn && certContainer) {
    showMoreBtn.addEventListener("click", () => {
      certContainer.classList.toggle("show-all");

      if (certContainer.classList.contains("show-all")) {
        showMoreBtn.textContent = "Show Less";
      } else {
        showMoreBtn.textContent = "Show More";
      }
    });
  }
}

// Initialize certificate toggle
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCertificateToggle);
} else {
  initCertificateToggle();
}

window.addEventListener("sectionsLoaded", initCertificateToggle);
