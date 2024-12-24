// Lyt til 'sectionsLoaded' event
window.addEventListener("sectionsLoaded", (event) => {
  const isMobile = event.detail.isMobile;
  if (isMobile) {
    removeGridTriggers();
  } else {
    horizontalScroller();
    initializeGridTriggers();
    addTestimonialAnimation();
  }
});

function horizontalScroller() {
  // horizonal scroll
  const horizontalContainer = document.querySelector(".section-wrapper");

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
}

// Funktion til at fjerne ScrollTriggers relateret til grid-effekten
function removeGridTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === document.querySelector(".sticky-container")) {
      console.log("Killing trigger for .sticky-container");
      trigger.kill();
    }
  });
}

// Funktion til at initialisere ScrollTriggers
function initializeGridTriggers() {
  var gridItems = document.querySelectorAll(".grid-item");
  var gridContainer = document.querySelector(".sticky-container");
  var blockContainer = document.querySelector(".block-container");

  // Fjern eventuelle eksisterende triggers, hvis de allerede er til stede
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.vars.trigger === gridContainer) {
      trigger.kill();
    }
  });

  gridItems.forEach(function (item, index) {
    var translateX, translateY;
    if (index % 3 < 1) {
      translateX = "-100vw";
    } else if (index % 3 > 1) {
      translateX = "100vw";
    } else {
      translateX = "0";
    }

    if (index < 3) {
      translateY = "-100vh";
    } else if (index > 5) {
      translateY = "100vh";
    } else {
      translateY = "0";
    }

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

function addTestimonialAnimation() {
  const originalScroller = document.querySelector(".testimonials-scroller");
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
}

// Lyt til resize event for at opdatere triggers
window.addEventListener("resize", () => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  // Re-initialiser triggers ved resize, baseret på mobilstatus
  if (isMobile) {
    removeGridTriggers();
  } else {
    initializeGridTriggers();
  }
});
