window.addEventListener("sectionsLoaded", (event) => {
  dynamicTextBoxForAudience();
  initializeShowMoreButton();
  initializeFadeInAnimation();
  setupSkillsAnimation();
  setupNumberAnimations();
  setupHighlightsObserver();
  initializeTestimonialDragScroll();
});

function dynamicTextBoxForAudience() {
  const audienceButtons = document.querySelectorAll(".audience-btn");
  const dynamicText = document.querySelector(".dynamic-text");
  const sectionBottom = document.querySelector(".landing-section-bottom");
  const sectionBackground = document.querySelector(
    ".landing-section-background",
  );

  // Set up ResizeObserver to refresh ScrollTrigger when landing section height changes
  let resizeTimeout;
  const resizeObserver = new ResizeObserver((entries) => {
    // Debounce to avoid excessive refresh calls
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 100);
  });

  // Observe the landing section bottom for size changes
  if (sectionBottom) {
    resizeObserver.observe(sectionBottom);
  }

  const audienceData = {
    anyone: {
      image: "../Images/heroBackground.png",
      theme: "audience-anyone",
      text: `
        I design and build products and experiences that connect digital technology with real-world interactions in meaningful and intuitive ways.
      `,
    },

    recruiters: {
      image: "../Images/heroBackground.png",
      theme: "audience-recruiters",
      text: `
        I design and build connected, cross-platform product experiences at the intersection of UX, systems thinking, and product strategy.
        <br>
        I focus on simplifying complexity while aligning business goals with user needs.
      `,
    },

    "product-designers": {
      image: "../Images/heroBackground.png",
      theme: "audience-product-designers",
      text: `
        At the intersection of UX, systems thinking, and product strategy - I shape connected experiences across digital and physical ecosystems.
      `,
    },

    engineers: {
      image: "../Images/heroBackground.png",
      theme: "audience-engineers",
      text: `
    I'm a <span class="accent"> highly_technical product_designer</span>. This.includes() { developing and designing physical and digital experiences, product strategy and project management };
    <br>
    while (I'm!=software_engineer) {
    I do have skills = [<i class="fab fa-unity"></i> Unity, <i class="fas fa-code"></i> .NET, <i class="fab fa-node-js"></i> Node.js, <i class="fas fa-database"></i> SQL];
      `,
    },
  };

  function switchAudience(audience) {
    const data = audienceData[audience];

    audienceButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.audience === audience);
    });

    sectionBottom.className = `landing-section-bottom ${data.theme}`;

    dynamicText.style.opacity = 0;

    setTimeout(() => {
      dynamicText.innerHTML = data.text;
      dynamicText.style.opacity = 1;

      // Update background image via CSS custom property on the background element
      sectionBackground.style.setProperty(
        "--background-image",
        `url('${data.image}')`,
      );

      // ResizeObserver will automatically trigger ScrollTrigger.refresh()
      // when the section height changes
    }, 200);
  }

  audienceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchAudience(button.dataset.audience);
    });
  });

  switchAudience("anyone");
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

  // Use lower threshold on mobile since the section is taller relative to viewport
  const isMobile = window.innerWidth <= 900;
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: isMobile ? 0.8 : 0.9,
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

// Testimonial drag/scroll functionality for both mobile and desktop
function initializeTestimonialDragScroll() {
  // This function runs after testimonials are initialized by mobile.js or desktop.js
  // It finds all testimonial scrollers (1 on mobile, 2 on desktop) and adds drag functionality
  const scrollers = document.querySelectorAll(".testimonials-scroller");

  scrollers.forEach((scroller) => {
    initializeTouchDrag(scroller);
  });
}

function initializeTouchDrag(scroller) {
  const scrollerInner = scroller.querySelector(".testimonials-scroller-inner");
  if (!scrollerInner) return;

  let startX = 0;
  let isDown = false;
  let isDragging = false;
  let dragOffset = 0;

  // Initialize CSS custom property for drag offset
  scrollerInner.style.setProperty("--drag-offset", "0px");

  // Get current animation progress (0 to 1)
  function getAnimationProgress() {
    const computedStyle = window.getComputedStyle(scrollerInner);
    const animationDuration =
      parseFloat(computedStyle.animationDuration) * 1000; // Convert to ms
    const animationDelay = parseFloat(computedStyle.animationDelay || 0) * 1000;

    if (animationDuration === 0) return 0;

    // Get elapsed time since animation started
    const startTime = performance.now() - (Date.now() % animationDuration);
    const elapsed =
      (performance.now() - startTime + animationDelay) % animationDuration;

    return elapsed / animationDuration;
  }

  // Pause animation and capture current position
  function pauseAnimation() {
    scrollerInner.style.animationPlayState = "paused";
  }

  // Resume animation from current position
  function resumeAnimation() {
    scrollerInner.style.animationPlayState = "running";
  }

  // Update drag offset
  function updateDragOffset(offset) {
    dragOffset = offset;
    scrollerInner.style.setProperty("--drag-offset", `${offset}px`);
  }

  // Mouse events for desktop
  function handleMouseStart(e) {
    isDown = true;
    isDragging = false;
    startX = e.pageX;
    scrollerInner.style.cursor = "grabbing";
    pauseAnimation();
  }

  function handleMouseMove(e) {
    if (!isDown) return;
    e.preventDefault();
    isDragging = true;

    const currentX = e.pageX;
    const deltaX = currentX - startX;
    updateDragOffset(dragOffset + deltaX);
    startX = currentX;
  }

  function handleMouseEnd() {
    isDown = false;
    scrollerInner.style.cursor = "grab";
    if (isDragging) {
      resumeAnimation();
      isDragging = false;
    }
  }

  // Touch events for mobile
  function handleTouchStart(e) {
    isDown = true;
    isDragging = false;
    const touch = e.touches[0];
    startX = touch.pageX;
    pauseAnimation();
  }

  function handleTouchMove(e) {
    if (!isDown) return;
    e.preventDefault();
    isDragging = true;

    const touch = e.touches[0];
    const currentX = touch.pageX;
    const deltaX = currentX - startX;
    updateDragOffset(dragOffset + deltaX);
    startX = currentX;
  }

  function handleTouchEnd() {
    isDown = false;
    if (isDragging) {
      resumeAnimation();
      isDragging = false;
    }
  }

  // Hover pause functionality
  scroller.addEventListener("mouseenter", () => {
    if (!isDown && !isDragging) {
      pauseAnimation();
    }
  });

  scroller.addEventListener("mouseleave", () => {
    if (!isDown && !isDragging) {
      resumeAnimation();
    }
  });

  // Add mouse event listeners
  scrollerInner.addEventListener("mousedown", handleMouseStart);
  scrollerInner.addEventListener("mousemove", handleMouseMove);
  scrollerInner.addEventListener("mouseup", handleMouseEnd);
  scrollerInner.addEventListener("mouseleave", handleMouseEnd);

  // Add touch event listeners
  scrollerInner.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  scrollerInner.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  scrollerInner.addEventListener("touchend", handleTouchEnd);

  // Prevent click events when dragging
  scrollerInner.addEventListener("click", (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Set initial cursor style
  scrollerInner.style.cursor = "grab";
}
