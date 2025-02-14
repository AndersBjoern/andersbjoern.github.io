window.addEventListener("sectionsLoaded", (event) => {
  const isMobile = event.detail.isMobile;
  if (isMobile) {
    removeGridTriggers();
  } else {
    initializeHorizontalScroller();
    initializeGridTriggers();
    initializeTestimonialAnimation();
  }
});

function initializeHorizontalScroller() {
  const horizontalContainer = document.querySelector(".section-wrapper");
  if (!horizontalContainer) return;

  function getScrollAmount() {
    const horizontalContainerWidth = horizontalContainer.scrollWidth;
    return -(horizontalContainerWidth - window.innerWidth);
  }

  const tween = gsap.to(horizontalContainer, {
    x: getScrollAmount,
    duration: 3,
    ease: "none",
  });

  const root = document.documentElement;
  const backgroundcolor = getComputedStyle(root).getPropertyValue(
    "--horizontal-scroller-background"
  );

  ScrollTrigger.create({
    trigger: ".horizontal",
    start: "top 0%",
    end: () => `+=${getScrollAmount() * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
    onEnter: () => {
      gsap.to(horizontalContainer, {
        background: backgroundcolor,
        duration: 0.5,
      });
    },
    onLeaveBack: () => {
      gsap.to(horizontalContainer, { background: "none", duration: 0.5 });
    },
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
  const translateY = index < 3 ? "-100vh" : index > 5 ? "100vh" : "0";
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
