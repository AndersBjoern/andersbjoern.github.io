window.addEventListener("sectionsLoaded", () => {
  initializeGSAPAnimations();
  initializeShowMoreButton();
  setupSkillsAnimation();
  setupNumberAnimations();
  setupHighlightsObserver();
});

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
  const backgroundcolor =
    getComputedStyle(root).getPropertyValue("--background-color");
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
