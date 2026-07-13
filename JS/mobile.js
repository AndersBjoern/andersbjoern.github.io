window.addEventListener("sectionsLoaded", (event) => {
  if (event.detail.isMobile) {
    initializeVideoPreloading();
    initializeConnectButtonEffect();
    initializeVideoScrollTrigger();
    initializeVideoMaskEffect();
    projectShowcaseButtons();
    initializeGallery();
    initializeTestimonialAnimation();
  }
});

function initializeVideoPreloading() {
  const videos = document.querySelectorAll(".scroll-trigger-video");
  if (!videos.length) return;

  // Try to enable autoplay on mobile after first user interaction
  let hasUserInteracted = false;
  const enableAutoplayAfterInteraction = () => {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      videos.forEach((video) => {
        // Remove the autoplay-failed attribute so videos can try to autoplay again
        video.removeAttribute("data-autoplay-failed");
        // Remove any existing play overlays
        const container = video.closest(".videoplayer-container");
        const overlay = container?.querySelector(".video-play-overlay");
        if (overlay) overlay.remove();
      });
    }
  };

  // Listen for first user interaction
  ["touchstart", "click", "scroll"].forEach((event) => {
    document.addEventListener(event, enableAutoplayAfterInteraction, {
      once: true,
      passive: true,
    });
  });

  videos.forEach((video) => {
    // Ensure mobile-friendly attributes are set
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // Set preload to metadata to load first frame
    video.preload = "metadata";

    // Force load to ensure first frame is available
    video.load();

    // Set a small currentTime to ensure first frame shows
    video.addEventListener(
      "loadedmetadata",
      () => {
        if (video.duration > 0) {
          video.currentTime = 0.1;
        }
      },
      { once: true },
    );

    // Ensure video poster/first frame is visible
    video.addEventListener(
      "loadeddata",
      () => {
        // Force a repaint to ensure the frame is visible
        video.style.opacity = "0.99";
        setTimeout(() => {
          video.style.opacity = "1";
        }, 10);
      },
      { once: true },
    );
  });
}

function initializeConnectButtonEffect() {
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

  // Detect if device likely supports autoplay
  const canAutoplay = () => {
    // Check if we're on a mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    return !isMobile; // Desktop usually allows autoplay, mobile usually doesn't
  };

  videos.forEach((video) => {
    // Ensure video is loaded and ready
    const ensureVideoReady = () => {
      return new Promise((resolve) => {
        if (video.readyState >= 2) {
          // HAVE_CURRENT_DATA or higher
          resolve();
        } else {
          video.addEventListener("loadeddata", resolve, { once: true });
          video.addEventListener("canplay", resolve, { once: true });
          // Force load the video
          video.load();
        }
      });
    };

    // Safe play function that ensures video is ready
    const safePlay = async () => {
      try {
        await ensureVideoReady();

        // Check if we can autoplay (mobile browsers often block this)
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (error) {
        console.log("Video autoplay blocked (likely mobile policy):", error);

        // If autoplay fails, we still want to trigger the visual effects
        // This will show the video frame and transition the mask/description
        const videoContainer = video.closest(".videoplayer-container");
        const projectArticle = video.closest("article.project-article");
        const projectDescription = projectArticle?.querySelector(
          ".project-description",
        );

        if (videoContainer) videoContainer.classList.add("playing");
        if (projectDescription)
          projectDescription.classList.add("video-playing");

        // Add a visual indicator that user needs to tap to play
        if (!video.hasAttribute("data-autoplay-failed")) {
          video.setAttribute("data-autoplay-failed", "true");

          // Create a play overlay
          const playOverlay = document.createElement("div");
          playOverlay.className = "video-play-overlay";
          playOverlay.innerHTML =
            '<i class="fa-solid fa-play"></i><span>Tap to play</span>';
          playOverlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 15px 20px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            cursor: pointer;
            z-index: 10;
            backdrop-filter: blur(5px);
            transition: opacity 0.3s ease;
          `;

          const container = video.closest(".videoplayer-container");
          if (container) {
            container.style.position = "relative";
            container.appendChild(playOverlay);

            // Remove overlay when user taps to play
            const removeOverlay = () => {
              playOverlay.remove();
              video.removeEventListener("play", removeOverlay);
            };

            video.addEventListener("play", removeOverlay);

            // Make overlay clickable
            playOverlay.addEventListener("click", () => {
              video
                .play()
                .then(() => {
                  removeOverlay();
                })
                .catch(console.log);
            });
          }
        }
      }
    };

    ScrollTrigger.create({
      trigger: video,
      start: "top 70%", // Start when video top is 70% down the viewport
      end: "bottom 30%", // End when video bottom is 30% up from bottom
      onEnter: () => safePlay(),
      onLeave: () => video.pause(),
      onEnterBack: () => safePlay(),
      onLeaveBack: () => video.pause(),
      // Better mobile support
      refreshPriority: 1,
      invalidateOnRefresh: true,
    });

    // Preload video metadata when it comes into a larger viewport
    ScrollTrigger.create({
      trigger: video,
      start: "top 90%", // Preload earlier but don't play yet
      onEnter: () => {
        if (video.readyState === 0) {
          video.load();
        }
      },
      once: true,
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
      ".project-description",
    );

    // Ensure video loads its first frame
    const ensureVideoFrame = () => {
      if (video.readyState === 0) {
        video.load();
      }
      // Set currentTime to 0 to ensure first frame is shown
      if (video.currentTime === 0 && video.readyState >= 2) {
        video.currentTime = 0.1;
      }
    };

    // Call on initialization
    ensureVideoFrame();

    // Also ensure frame is loaded when video metadata loads
    video.addEventListener("loadedmetadata", ensureVideoFrame);
    video.addEventListener("loadeddata", ensureVideoFrame);

    video.addEventListener("play", () => {
      if (videoContainer) videoContainer.classList.add("playing");
      if (projectDescription) projectDescription.classList.add("video-playing");
    });

    video.addEventListener("pause", () => {
      if (videoContainer) videoContainer.classList.remove("playing");
      if (projectDescription)
        projectDescription.classList.remove("video-playing");
    });

    // Handle loading states
    video.addEventListener("waiting", () => {
      // Video is buffering, keep the mask
      if (videoContainer) videoContainer.classList.remove("playing");
    });

    video.addEventListener("canplay", () => {
      // Video can play, ensure first frame is visible
      ensureVideoFrame();
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
    ".thumbnail-gallery .gallery-item img",
  );

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      featuredImage.src = thumbnail.src;
      thumbnails.forEach((thumb) =>
        thumb.parentElement.classList.remove("active"),
      );
      thumbnail.parentElement.classList.add("active");
    });
  });
}

function initializeScrollerContent(scroller, index) {
  const scrollerInner = scroller.querySelector(".testimonials-scroller-inner");
  if (!scrollerInner) return;

  const scrollerContent = Array.from(scrollerInner.children);

  // Mobile only has one scroller, no need to rearrange starting position
  scrollerInner.innerHTML = "";
  scrollerContent.forEach((item) => {
    scrollerInner.appendChild(item);
  });

  // Duplicate items for infinite scroll effect
  scrollerContent.forEach((item) => {
    const duplicatedItem = item.cloneNode(true);
    duplicatedItem.setAttribute("aria-hidden", true);
    scrollerInner.appendChild(duplicatedItem);
  });
}

function initializeTestimonialAnimation() {
  const scrollers = document.querySelectorAll(".testimonials-scroller");

  scrollers.forEach((scroller, index) => {
    // Mobile only has one scroller, always scroll left
    scroller.setAttribute("data-direction", "left");
    scroller.setAttribute("data-animated", true);

    initializeScrollerContent(scroller, index);
  });
}
