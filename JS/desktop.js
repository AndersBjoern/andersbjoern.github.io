// Lyt til 'sectionsLoaded' event
window.addEventListener("sectionsLoaded", (event) => {
  const isMobile = event.detail.isMobile;

  // Fjern alle ScrollTriggers relateret til .sticky-container, når du ikke er på mobil
  if (isMobile) {
    removeGridTriggers();
  } else {
    // Initialiser grid triggers på desktop
    initializeGridTriggers();
  }
});

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
      console.log("Killed previous triggers before re-initializing");
    }
  });

  gridItems.forEach(function (item, index) {
    console.log("Creating trigger for grid-item", index);

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
