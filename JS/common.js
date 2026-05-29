window.addEventListener("sectionsLoaded", (event) => {
  console.log("🚀 sectionsLoaded event fired", {
    isMobile: event.detail.isMobile,
    windowWidth: window.innerWidth,
    userAgent: navigator.userAgent,
  });

  initStickyTitle();
  initializeGSAPAnimations();
  initializeShowMoreButton();
  initializeFadeInAnimation();
  setupSkillsAnimation();
  setupNumberAnimations();
  setupHighlightsObserver();
});

function initStickyTitle() {
  const title = document.querySelector(".landing-section h2");

  if (!title) {
    console.log("❌ Sticky title: h2 element not found");
    return;
  }

  const sentinel = document.createElement("div");
  sentinel.style.cssText =
    "position: absolute; top: 0; left: 0; width: 1px; height: 1px; pointer-events: none;";
  sentinel.className = "sticky-sentinel";

  title.parentElement.insertBefore(sentinel, title);

  const observer = new IntersectionObserver(
    ([entry]) => {
      const shouldStick =
        !entry.isIntersecting && entry.boundingClientRect.top < 0;

      console.log("👁️ IntersectionObserver triggered:", {
        isIntersecting: entry.isIntersecting,
        boundingTop: entry.boundingClientRect.top,
        shouldStick: shouldStick,
        hasClass: title.classList.contains("sticky-header"),
      });

      if (shouldStick) {
        if (!title.classList.contains("sticky-header")) {
          title.classList.add("sticky-header");
          console.log("✅ Added sticky-header class");

          // Verify it was applied
          const computedStyle = window.getComputedStyle(title);
          console.log("🔍 Computed styles after adding class:", {
            position: computedStyle.position,
            top: computedStyle.top,
            zIndex: computedStyle.zIndex,
            background: computedStyle.background,
          });
        }
      } else {
        if (title.classList.contains("sticky-header")) {
          title.classList.remove("sticky-header");
          console.log("❌ Removed sticky-header class");
        }
      }
    },
    {
      threshold: [0, 1],
      rootMargin: "-1px 0px 0px 0px", // Trigger when sentinel is 1px past the top
    },
  );

  observer.observe(sentinel);
  console.log("👂 IntersectionObserver attached to sentinel");
}

function initializeGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const text = document.querySelector("h1");
  if (!text) return;

  const char = text.querySelectorAll("span");
  const replaceChar = text.querySelectorAll('span:not([data-char="."])');
  const tl = gsap.timeline();

  tl.set(char, { yPercent: -110 })
    .set(text, { autoAlpha: 1 })
    .to(char, {
      duration: 1,
      yPercent: 0,
      stagger: 0.05,
      ease: "expo.inOut",
    })
    .to(replaceChar, {
      duration: 1,
      yPercent: 110,
      ease: "expo.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
    });
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
