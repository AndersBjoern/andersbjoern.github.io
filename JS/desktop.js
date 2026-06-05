window.addEventListener("sectionsLoaded", (event) => {
  const isMobile = event.detail.isMobile;
  if (isMobile) {
    removeGridTriggers();
  } else {
    initializeHorizontalScroller();
    initializeGridTriggers();
    initializeTestimonialAnimation();
    //initializeCustomCursor();
  }
});

function initializeHorizontalScroller() {
  const horizontalContainer = document.querySelector(".projects-track");
  const horizontalSection = document.querySelector(".horizontal");
  if (!horizontalContainer || !horizontalSection) return;

  function getScrollAmount() {
    const horizontalContainerWidth = horizontalContainer.scrollWidth;
    return -(horizontalContainerWidth - window.innerWidth);
  }

  const tween = gsap.to(horizontalContainer, {
    x: getScrollAmount,
    duration: 3,
    ease: "none",
  });

  const scrollTriggerInstance = ScrollTrigger.create({
    trigger: ".horizontal",
    start: "top 0%",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
  });

  // Handle horizontal wheel events on the entire window
  const handleHorizontalScroll = (e) => {
    // Check if there's horizontal scroll (trackpad horizontal gesture or shift+wheel)
    const hasHorizontalScroll =
      Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.deltaX !== 0;

    if (hasHorizontalScroll) {
      const currentScroll = window.pageYOffset || window.scrollY;
      const scrollStart = scrollTriggerInstance.start;
      const scrollEnd = scrollTriggerInstance.end;

      // Only handle horizontal scroll if we're within the horizontal section bounds
      if (currentScroll >= scrollStart && currentScroll <= scrollEnd) {
        e.preventDefault();
        e.stopPropagation();

        // Convert horizontal delta to vertical scroll amount
        const scrollSpeed = 2; // Adjust this to control sensitivity
        const scrollAmount = e.deltaX * scrollSpeed;

        // Calculate new scroll position
        const newScroll = currentScroll + scrollAmount;

        // Clamp to the horizontal section bounds
        const clampedScroll = Math.max(
          scrollStart,
          Math.min(scrollEnd, newScroll),
        );

        // Smoothly scroll to the new position
        window.scrollTo({
          top: clampedScroll,
          behavior: "auto",
        });
      }
    }
  };

  // Add event listener to window
  window.addEventListener("wheel", handleHorizontalScroll, { passive: false });

  // Also add to the horizontal section itself for better capture
  horizontalSection.addEventListener("wheel", handleHorizontalScroll, {
    passive: false,
  });
}

function removeGridTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => {
    const stickyContainer = document.querySelector(".sticky-container");
    if (trigger.vars.trigger === stickyContainer) {
      console.log("Killing trigger for .sticky-container");
      trigger.kill();
    }
  });
}

function initializeGridTriggers() {
  const gridItems = document.querySelectorAll(".grid-item");
  const gridContainer = document.querySelector(".sticky-container");
  const blockContainer = document.querySelector(".block-container");
  if (!gridContainer || !blockContainer || gridItems.length === 0) return;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === gridContainer) {
      trigger.kill();
    }
  });

  gridItems.forEach((item, index) => {
    const { translateX, translateY } = calculateGridTranslation(index);

    gsap.to(item, {
      scrollTrigger: {
        trigger: gridContainer,
        start: "center center",
        endTrigger: blockContainer,
        end: "bottom center",
        scrub: true,
        id: `grid-trigger-${index}`,
      },
      scale: 3.7,
      x: translateX,
      y: translateY,
    });
  });
}

function calculateGridTranslation(index) {
  const translateX = index % 3 < 1 ? "-100vw" : index % 3 > 1 ? "100vw" : "0";
  const translateY = index < 3 ? "-100lvh" : index > 5 ? "100lvh" : "0";
  return { translateX, translateY };
}

function initializeTestimonialAnimation() {
  const originalScroller = document.querySelector(".testimonials-scroller");
  if (!originalScroller) return;

  const container = originalScroller.parentElement;
  for (let i = 0; i < 1; i++) {
    const clonedScroller = originalScroller.cloneNode(true);
    container.appendChild(clonedScroller);
  }

  const scrollers = document.querySelectorAll(".testimonials-scroller");

  scrollers.forEach((scroller, index) => {
    const direction = index === 1 ? "right" : "left";
    scroller.setAttribute("data-direction", direction);
    scroller.setAttribute("data-animated", true);

    initializeScrollerContent(scroller, index);
  });
}

function initializeScrollerContent(scroller, index) {
  const scrollerInner = scroller.querySelector(".testimonials-scroller-inner");
  const scrollerContent = Array.from(scrollerInner.children);
  const startIndex = index === 1 ? 4 : index === 2 ? 2 : 0;

  const rearrangedContent = [
    ...scrollerContent.slice(startIndex),
    ...scrollerContent.slice(0, startIndex),
  ];

  scrollerInner.innerHTML = "";
  rearrangedContent.forEach((item) => {
    scrollerInner.appendChild(item);
  });

  rearrangedContent.forEach((item) => {
    const duplicatedItem = item.cloneNode(true);
    duplicatedItem.setAttribute("aria-hidden", true);
    scrollerInner.appendChild(duplicatedItem);
  });
}

// Custom Cursor Implementation
function initializeCustomCursor() {
  new CustomCursor();
}

class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorText = null;
    this.cursorArrow = null;
    this.isVisible = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.speed = 1; // Smooth follow speed
    this.currentState = null;

    // Define cursor states with their text
    this.states = {
      SCROLL: {
        name: "scroll",
        text: "scroll · scroll · ",
        className: "cursor-state-scroll",
      },
      CLICK_TO_OPEN: {
        name: "click-to-open",
        text: "click to open · ",
        className: "cursor-state-click-to-open",
      },
    };

    this.init();
  }

  init() {
    // Create cursor element
    this.cursor = document.createElement("div");
    this.cursor.className = "custom-cursor";

    // Create the circular text container
    this.cursorText = document.createElement("div");
    this.cursorText.className = "cursor-text";

    // Create the arrow element (for click-to-open state)
    this.cursorArrow = document.createElement("div");
    this.cursorArrow.className = "cursor-arrow";

    this.cursor.appendChild(this.cursorText);
    this.cursor.appendChild(this.cursorArrow);
    document.body.appendChild(this.cursor);

    // Set initial state
    this.setState(this.states.SCROLL);

    // Bind events
    this.bindEvents();

    // Start animation loop
    this.animate();
  }

  setState(state) {
    if (this.currentState === state) return;

    // Remove previous state class
    if (this.currentState) {
      this.cursor.classList.remove(this.currentState.className);
    }

    // Set new state
    this.currentState = state;
    this.cursor.classList.add(state.className);

    // Update text
    this.updateText(state.text);
  }

  updateText(text) {
    // Clear existing text
    this.cursorText.innerHTML = "";

    // For click-to-open state, create a pill-shaped container
    if (this.currentState === this.states.CLICK_TO_OPEN) {
      const pillContainer = document.createElement("div");
      pillContainer.className = "cursor-pill";
      pillContainer.textContent = "click to open";
      this.cursorText.appendChild(pillContainer);
    } else {
      // Create individual characters for circular arrangement
      const characters = text.split("");

      characters.forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.setProperty("--char-index", index);
        span.style.setProperty("--total-chars", characters.length);
        this.cursorText.appendChild(span);
      });
    }
  }

  bindEvents() {
    // Track mouse movement
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.show();
      }

      // Check what element is being hovered
      this.checkHoveredElement(e);
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      this.hide();
    });

    // Show cursor when entering window
    document.addEventListener("mouseenter", () => {
      this.show();
    });

    // Check if we're in the horizontal section
    this.checkHorizontalSection();
    window.addEventListener("scroll", () => {
      this.checkHorizontalSection();
      // Also check hovered element when scrolling
      this.checkHoveredElementAtCurrentPosition();
    });
  }

  checkHoveredElementAtCurrentPosition() {
    // Check what's under the cursor at the current mouse position
    this.cursor.style.pointerEvents = "none";
    const elementUnderCursor = document.elementFromPoint(
      this.mouseX,
      this.mouseY,
    );
    this.cursor.style.pointerEvents = "none";

    if (!elementUnderCursor) return;

    // Check if hovering over a project article
    const projectArticle = elementUnderCursor.closest(".project-article");

    if (projectArticle) {
      this.setState(this.states.CLICK_TO_OPEN);
    } else {
      this.setState(this.states.SCROLL);
    }
  }

  checkHoveredElement(e) {
    // Get the element under the cursor (excluding the cursor itself)
    this.cursor.style.pointerEvents = "none";
    const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
    this.cursor.style.pointerEvents = "none"; // Keep it disabled

    if (!elementUnderCursor) return;

    // Check if hovering over a project article
    const projectArticle = elementUnderCursor.closest(".project-article");

    if (projectArticle) {
      this.setState(this.states.CLICK_TO_OPEN);
    } else {
      this.setState(this.states.SCROLL);
    }
  }

  checkHorizontalSection() {
    const horizontalSection = document.querySelector(".horizontal");
    if (!horizontalSection) return;

    const rect = horizontalSection.getBoundingClientRect();
    const isInSection = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isInSection) {
      this.cursor.classList.add("active");
    } else {
      this.cursor.classList.remove("active");
    }
  }

  show() {
    this.isVisible = true;
    this.cursor.classList.add("visible");
  }

  hide() {
    this.isVisible = false;
    this.cursor.classList.remove("visible");
  }

  animate() {
    // Smooth follow effect
    this.cursorX += (this.mouseX - this.cursorX) * this.speed;
    this.cursorY += (this.mouseY - this.cursorY) * this.speed;

    // Update cursor position
    // For scroll state, center the cursor at mouse position
    // For click-to-open, position at cursor without centering
    if (this.currentState === this.states.SCROLL) {
      this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`;
    } else {
      this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
    }

    // Continue animation
    requestAnimationFrame(() => this.animate());
  }
}
