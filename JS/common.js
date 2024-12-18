window.addEventListener("sectionsLoaded", (event) => {
  //! fix mærkelig height af horisontal scroll
  //! fix videoplayer
  //! tilføj videoplayer Moesgaard
  //! text animation (50% ----> 75% VR training) & lego: Digital Empowerment black color white outline
  //! background color
  //! icons

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

  // horizonal scroll
  const horizontalContainer = document.querySelector(".horizontal-section");

  function getScrollAmount() {
    let horizontalContainerWidth = horizontalContainer.scrollWidth;
    return -(horizontalContainerWidth - window.innerWidth);
  }

  const tween = gsap.to(horizontalContainer, {
    x: getScrollAmount,
    duration: 3,
    ease: "none",
  });

  const root = document.documentElement;
  const contrastColor =
    getComputedStyle(root).getPropertyValue("--contrast-color");

  const horizontalScrollTrigger = ScrollTrigger.create({
    trigger: ".horizontal",
    start: "top 0%",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
    onEnter: () => {
      gsap.to(horizontalContainer, {
        background: `linear-gradient(90deg, rgba(2,0,36,0.695203081232493) 24%, rgba(21,9,100,1) 50%, ${contrastColor} 84%)`,
        duration: 0.5,
      });
    },
    onLeaveBack: () => {
      gsap.to(horizontalContainer, { background: "none", duration: 0.5 });
    },
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

  const skillsSection = document.querySelector(".highlights-section");
  const blackBackground = document.querySelector(".black-background");
  const body = document.body;

  // Opret en ScrollTrigger
  ScrollTrigger.create({
    trigger: skillsSection,
    start: "top center", // Justér dette efter dine behov
    end: "bottom center", // Justér dette efter dine behov
    onEnter: () => {
      // Animation, når sektionen er i visning
      gsap.to(body, { backgroundColor: "white", duration: 1 });
      gsap.to(blackBackground, {
        color: "white",
        width: "95vw",
        borderTopRightRadius: "40px",
        borderBottomRightRadius: "40px",
        duration: 1,
      });
    },
    onLeaveBack: () => {
      // Animation, når sektionen forlader visning
      gsap.to(body, { backgroundColor: "black", duration: 1 });
      gsap.to(blackBackground, {
        color: "black",
        width: "100vw",
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
        duration: 1,
      });
    },
  });

  const addTestimonialAnimation = () => {
    const scrollers = document.querySelectorAll(".testimonials-scroller");

    scrollers.forEach((scroller, index) => {
      const direction = index === 1 ? "right" : "left";
      scroller.setAttribute("data-direction", direction);

      scroller.setAttribute("data-animated", true);

      const scrollerInner = scroller.querySelector(
        ".testimonials-scroller-inner"
      );
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
    });
  };

  const duplicateTestimonialRows = () => {
    const originalScroller = document.querySelector(".testimonials-scroller");
    const container = originalScroller.parentElement;

    for (let i = 0; i < 2; i++) {
      const clonedScroller = originalScroller.cloneNode(true);
      container.appendChild(clonedScroller);
    }
  };

  duplicateTestimonialRows();
  addTestimonialAnimation();
});
