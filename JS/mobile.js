window.addEventListener("sectionsLoaded", (event) => {
  if (event.detail.isMobile) {
    initializeContactButtonEffect();
    initializeVideoScrollTrigger();
    initializeVideoMaskEffect();
    projectShowcaseButtons();
    initializeGallery();
    initializeTestimonialAnimation();
  }
});

function initializeContactButtonEffect() {
  ScrollTrigger.create({
    trigger: ".contact-button",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => {
      document.querySelector(".connect-button").style.opacity = "0";
      document.querySelector(".connect-button").style.pointerEvents = "none";
    },
    onLeaveBack: () => {
      document.querySelector(".connect-button").style.opacity = "1";
      document.querySelector(".connect-button").style.pointerEvents = "auto";
    },
    onLeave: () => {
      document.querySelector(".connect-button").style.opacity = "1";
      document.querySelector(".connect-button").style.pointerEvents = "auto";
    },
    onEnterBack: () => {
      document.querySelector(".connect-button").style.opacity = "0";
      document.querySelector(".connect-button").style.pointerEvents = "none";
    },
  });
}

function initializeVideoScrollTrigger() {
  const videos = document.querySelectorAll(".scroll-trigger-video");
  if (!videos.length) return;

  videos.forEach((video) => {
    ScrollTrigger.create({
      trigger: video,
      start: "top center",
      end: "bottom center",
      onEnter: () => video.play(),
      onLeave: () => video.pause(),
      onEnterBack: () => video.play(),
      onLeaveBack: () => video.pause(),
    });
  });
}

function initializeVideoMaskEffect() {
  const videos = document.querySelectorAll(".scroll-trigger-video");
  if (!videos.length) return;

  videos.forEach((video) => {
    const videoContainer = video.closest(".videoplayer-container");
    const projectArticle = video.closest("article.project-article");
    const projectDescription = projectArticle?.querySelector(
      ".project-description"
    );

    video.addEventListener("play", () => {
      if (videoContainer) videoContainer.classList.add("playing");
      if (projectDescription) projectDescription.classList.add("video-playing");
    });

    video.addEventListener("pause", () => {
      if (videoContainer) videoContainer.classList.remove("playing");
      if (projectDescription)
        projectDescription.classList.remove("video-playing");
    });
  });
}

/*
function videoScrollerPlay() {
  let video = document.getElementById("scroll-video");
  video.addEventListener("canplaythrough", () => {
    video.pause();

    let scrollTrigger = ScrollTrigger.create({
      trigger: ".video-scroll-player-container",
      start: "top bottom",
      end: "top 0",
      scrub: 1,
      onUpdate: (self) => {
        let progress = self.progress;
        video.currentTime = progress * video.duration;
      },
    });
  });
}
*/

function projectShowcaseButtons() {
  document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", () => {
      const article = button.closest("article");
      const contentWrapper = article.querySelector(".article-content-wrapper");

      article.classList.add("expanded");

      button.remove();

      contentWrapper.style.maxHeight = "8000px";
    });
  });
}

function initializeGallery() {
  const featuredImage = document.getElementById("featuredImage");
  const thumbnails = document.querySelectorAll(
    ".thumbnail-gallery .gallery-item img"
  );

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      featuredImage.src = thumbnail.src;
      thumbnails.forEach((thumb) =>
        thumb.parentElement.classList.remove("active")
      );
      thumbnail.parentElement.classList.add("active");
    });
  });
}

function initializeScrollerContent(scroller, index) {
  const scrollerInner = scroller.querySelector(".testimonials-scroller-inner");
  if (!scrollerInner) return;

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

function initializeTestimonialAnimation() {
  const scrollers = document.querySelectorAll(".testimonials-scroller");

  scrollers.forEach((scroller, index) => {
    const direction = index === 1 ? "right" : "left";
    scroller.setAttribute("data-direction", direction);
    scroller.setAttribute("data-animated", true);

    initializeScrollerContent(scroller, index);
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
