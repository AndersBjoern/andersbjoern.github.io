window.addEventListener("sectionsLoaded", (event) => {
  //! fix mærkelig height af horisontal scroll
  //! fix videoplayer
  //! tilføj videoplayer Moesgaard
  //! text animation (50% ----> 75% VR training) & lego: Digital Empowerment black color white outline
  //! background color
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

  const skillsSection = document.querySelector(".highlights-section");
  const blackBackground = document.querySelector(".black-background");
  const body = document.body;

  // Opret en ScrollTrigger
  ScrollTrigger.create({
    trigger: skillsSection,
    start: "top center", // Justér dette efter dine behov
    end: "bottom center", // Justér dette efter dine behov
    markers: true,
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

  function animateCounter(element, targetNumber) {
    const countDuration = 2; // Varighed på 2 sekunder
    gsap.fromTo(
      element,
      { innerHTML: 0 },
      {
        innerHTML: targetNumber,
        duration: countDuration,
        ease: "power1.out",
        snap: { innerHTML: 1 }, // Afrunder til nærmeste heltal
        onUpdate: function () {
          element.textContent = Math.round(this.targets()[0].innerHTML) + "+"; // Tilføj "+" efter tallet
        },
      }
    );
  }

  // Vælg alle .numbers elementer
  const numbers = document.querySelectorAll(".numbers");

  numbers.forEach((number) => {
    const h3 = number.querySelector("h3");
    const target = parseInt(h3.dataset.target, 10); // Hent det ønskede mål fra data-target

    // Animer forstørrelse og opdater tal samtidigt
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
          onEnter: () => animateCounter(h3, target), // Start tælling, når elementet kommer i view
        },
      }
    );
  });
});
