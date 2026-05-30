window.addEventListener("sectionsLoaded", (event) => {
  initStickyTitle();
  dynamicTextBoxForAudience();
  initializeShowMoreButton();
  initializeFadeInAnimation();
  setupSkillsAnimation();
  setupNumberAnimations();
  setupHighlightsObserver();
});

function initStickyTitle() {
  const wrapper = document.querySelector(".sticky-title-wrapper");
  const title = wrapper.querySelector("h2");

  gsap.set(wrapper, {
    position: "fixed",
    top: "5vh",
    left: "2.5vw",
    scale: 2,
    transformOrigin: "left top",
    x: 0,
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "+=600",
      scrub: true,
    },
  });

  // =========================
  // PHASE 1: 0–300px
  // =========================
  tl.to(
    wrapper,
    {
      top: 20,
      scale: 1,
      backgroundColor: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(12px)",
      webkitBackdropFilter: "blur(12px)",
      padding: "12px 16px",
      borderRadius: "999px",
      ease: "none",
      duration: 300,
    },
    0,
  );

  // font shrink separat (smooth kontrol)
  tl.to(
    title,
    {
      fontSize: "1.1rem",
      ease: "none",
      duration: 300,
    },
    0,
  );

  // =========================
  // PHASE 2: 300–450px
  // =========================
  tl.to(wrapper, {
    x: () => {
      const left = window.innerWidth * 0.025;
      const targetRight = window.innerWidth * 0.975;
      const width = wrapper.offsetWidth;

      return targetRight - width - left;
    },
    ease: "none",
    duration: 150,
  });
}

function dynamicTextBoxForAudience() {
  const audienceButtons = document.querySelectorAll(".audience-btn");
  const dynamicTexts = document.querySelectorAll(".dynamic-text");
  const audienceSelector = document.querySelector(".audience-selector");

  // Function to switch active audience
  function switchAudience(targetAudience) {
    // Update button states
    audienceButtons.forEach((btn) => {
      if (btn.dataset.audience === targetAudience) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update text visibility with smooth transition
    dynamicTexts.forEach((text) => {
      if (text.dataset.audience === targetAudience) {
        text.style.display = "block";
        // Force reflow to ensure transition works
        text.offsetHeight;
      } else {
        text.style.display = "none";
      }
    });
  }

  // Add click event listeners to buttons
  audienceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const audience = this.dataset.audience;
      switchAudience(audience);
    });
  });

  // Check if scrolling is needed and apply gradient mask
  function checkScrollable() {
    if (audienceSelector) {
      const inner = audienceSelector.querySelector(".audience-selector-inner");
      if (inner && inner.scrollWidth > audienceSelector.clientWidth) {
        audienceSelector.setAttribute("data-animated", "true");
      } else {
        audienceSelector.setAttribute("data-animated", "false");
      }
    }
  }

  // Check on load and resize
  checkScrollable();
  window.addEventListener("resize", checkScrollable);

  // Optional: Add smooth scroll behavior for touch devices
  if (audienceSelector) {
    let isDown = false;
    let startX;
    let scrollLeft;

    audienceSelector.addEventListener("mousedown", (e) => {
      isDown = true;
      audienceSelector.style.cursor = "grabbing";
      startX = e.pageX - audienceSelector.offsetLeft;
      scrollLeft = audienceSelector.scrollLeft;
    });

    audienceSelector.addEventListener("mouseleave", () => {
      isDown = false;
      audienceSelector.style.cursor = "default";
    });

    audienceSelector.addEventListener("mouseup", () => {
      isDown = false;
      audienceSelector.style.cursor = "default";
    });

    audienceSelector.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - audienceSelector.offsetLeft;
      const walk = (x - startX) * 2;
      audienceSelector.scrollLeft = scrollLeft - walk;
    });
  }
}

function initializeShowMoreButton() {
  const showMoreButton = document.querySelector(".show-more-btn");
  if (showMoreButton) {
    showMoreButton.addEventListener("click", function () {
      const container = document.querySelector(".cert-container");
      container.classList.toggle("show-all");
      this.textContent = container.classList.contains("show-all")
        ? "Show Less"
        : "Show More";
    });
  }
}

function initializeFadeInAnimation() {
  const fadeElements = document.querySelectorAll(".fade-effect");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("fade-out");
          entry.target.classList.add("fade-in");
        } else {
          entry.target.classList.remove("fade-in");
          entry.target.classList.add("fade-out");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  fadeElements.forEach((el) => observer.observe(el));
}

function setupSkillsAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scrollers = document.querySelectorAll(".skills-scroller");
  scrollers.forEach((scroller) => {
    scroller.setAttribute("data-animated", true);

    const scrollerInner = scroller.querySelector(".scroller_inner");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

function setupNumberAnimations() {
  const numbers = document.querySelectorAll(".numbers");

  if (!numbers.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.8,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numberElement = entry.target;
        const h3 = numberElement.querySelector("h3");
        if (!h3) return;

        const target = parseInt(h3.dataset.target, 10);

        numberElement.style.transform = "scale(1)";
        numberElement.style.opacity = "1";
        animateCounter(h3, target);
      } else {
        const numberElement = entry.target;
        numberElement.style.transform = "scale(0.8)";
        numberElement.style.opacity = "0";
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  numbers.forEach((number) => {
    number.style.transform = "scale(0.8)";
    number.style.opacity = "0";
    observer.observe(number);
  });
}

function animateCounter(element, targetNumber) {
  const countDuration = 2000;
  const frameRate = 30;
  const totalFrames = Math.round((countDuration / 1000) * frameRate);
  const increment = targetNumber / totalFrames;

  let currentNumber = 0;
  let frame = 0;

  const counterInterval = setInterval(() => {
    frame++;
    currentNumber += increment;

    if (frame >= totalFrames) {
      currentNumber = targetNumber;
      clearInterval(counterInterval);
    }

    element.textContent = `${Math.round(currentNumber)}+`;
  }, 1000 / frameRate);
}

function setupHighlightsObserver() {
  const highlightsSection = document.querySelector(".highlights-section");
  const blackBackground = document.querySelector(".black-background");
  const body = document.body;

  const root = document.documentElement;
  const backgroundcolor = getComputedStyle(root).getPropertyValue(
    "--background-color-dark",
  );
  const fontColor = getComputedStyle(root).getPropertyValue("--font-color");

  if (!highlightsSection || !blackBackground) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.6,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;

      body.style.transition = "background-color 1s ease";
      blackBackground.style.transition = "all 1s ease";

      if (isIntersecting) {
        body.style.backgroundColor = "white";
        blackBackground.style.color = fontColor;
        blackBackground.style.width = "95vw";
        blackBackground.style.borderTopRightRadius = "40px";
        blackBackground.style.borderBottomRightRadius = "40px";
      } else {
        body.style.backgroundColor = backgroundcolor;
        blackBackground.style.color = backgroundcolor;
        blackBackground.style.width = "100vw";
        blackBackground.style.borderTopRightRadius = "0";
        blackBackground.style.borderBottomRightRadius = "0";
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(highlightsSection);
}
