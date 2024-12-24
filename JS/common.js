window.addEventListener("sectionsLoaded", (event) => {
  //! variabler i SCSS : farver, 900px width
  //! tilføj videoplayer Moesgaard
  //! icons

  document
    .querySelector(".show-more-btn")
    .addEventListener("click", function () {
      const container = document.querySelector(".cert-container");
      container.classList.toggle("show-all");
      this.textContent = container.classList.contains("show-all")
        ? "Show Less"
        : "Show More";
    });

  gsap.registerPlugin(ScrollTrigger);

  var text = document.querySelector("h1"),
    char = text.querySelectorAll("span"),
    replaceChar = text.querySelectorAll('span:not([data-char="."])');

  var tl = gsap.timeline();

  tl.set(char, {
    yPercent: -110,
  });
  tl.set(text, {
    autoAlpha: 1,
  });
  tl.to(char, {
    duration: 1,
    yPercent: 0,
    stagger: 0.05,
    ease: "expo.inOut",
  }).to(replaceChar, {
    duration: 1,
    yPercent: 110,
    ease: "expo.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.1,
  });

  // "skills" animation:
  const addAnimation = () => {
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
  };

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }
  const highlightsSection = document.querySelector(".highlights-section");
  const blackBackground = document.querySelector(".black-background");
  const body = document.body;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.6,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        body.style.transition = "background-color 1s ease";
        body.style.backgroundColor = "white";

        blackBackground.style.transition = "all 1s ease";
        blackBackground.style.color = "white";
        blackBackground.style.width = "95vw";
        blackBackground.style.borderTopRightRadius = "40px";
        blackBackground.style.borderBottomRightRadius = "40px";
      } else {
        body.style.transition = "background-color 1s ease";
        body.style.backgroundColor = "black";

        blackBackground.style.transition = "all 1s ease";
        blackBackground.style.color = "black";
        blackBackground.style.width = "100vw";
        blackBackground.style.borderTopRightRadius = "0";
        blackBackground.style.borderBottomRightRadius = "0";
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(highlightsSection);

  function animateCounter(element, targetNumber) {
    const countDuration = 2; // Varighed på 2 sekunder
    gsap.fromTo(
      element,
      { innerHTML: 0 },
      {
        innerHTML: targetNumber,
        duration: countDuration,
        ease: "power1.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          element.textContent = Math.round(this.targets()[0].innerHTML) + "+";
        },
      }
    );
  }

  const numbers = document.querySelectorAll(".numbers");

  numbers.forEach((number) => {
    const h3 = number.querySelector("h3");
    const target = parseInt(h3.dataset.target, 10);

    gsap.fromTo(
      number,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: number,
          start: "top 80%",
          toggleActions: "play none none reset",
          onEnter: () => animateCounter(h3, target),
        },
      }
    );
  });
});
