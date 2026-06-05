window.addEventListener("sectionsLoaded", (event) => {
  dynamicTextBoxForAudience();
  initializeShowMoreButton();
  initializeFadeInAnimation();
  setupSkillsAnimation();
  setupNumberAnimations();
  setupHighlightsObserver();
});

function dynamicTextBoxForAudience() {
  const audienceButtons = document.querySelectorAll(".audience-btn");
  const dynamicText = document.querySelector(".dynamic-text");
  const sectionBottom = document.querySelector(".landing-section-bottom");
  const sectionBackground = document.querySelector(
    ".landing-section-background",
  );

  // Set up ResizeObserver to refresh ScrollTrigger when landing section height changes
  let resizeTimeout;
  const resizeObserver = new ResizeObserver((entries) => {
    // Debounce to avoid excessive refresh calls
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 100);
  });

  // Observe the landing section bottom for size changes
  if (sectionBottom) {
    resizeObserver.observe(sectionBottom);
  }

  const audienceData = {
    anyone: {
      image: "../Images/heroBackground.png",
      theme: "audience-anyone",
      text: `
        I design connected experiences where products,
        platforms, and user journeys behave as one system
        - not isolated features.
        <br><br>
        My focus is turning complex digital ecosystems into simple,
        intuitive and meaningful user experiences across contexts.
      `,
    },

    recruiters: {
      image: "../Images/heroBackground.png",
      theme: "audience-recruiters",
      text: `
        I work at the intersection of UX, systems thinking,
        and product strategy.
        <br><br>
        My strength is simplifying complexity while aligning
        business goals with user needs.
      `,
    },

    "product-managers": {
      image: "../Images/heroBackground.png",
      theme: "audience-product-managers",
      text: `
        I help product teams create coherence across features,
        journeys, and touchpoints.
        <br><br>
        I focus on user value, prioritization,
        and scalable experience systems.
      `,
    },

    "product-designers": {
      image: "../Images/heroBackground.png",
      theme: "audience-product-designers",
      text: `
        My approach combines interaction design,
        systems thinking and UX architecture.
        <br><br>
        I enjoy creating products where complexity feels invisible.
      `,
    },

    engineers: {
      image: "../Images/heroBackground.png",
      theme: "audience-engineers",
      text: `
    I'm a <span class="keyword">highly_technical_product_designer</span>. <span class="function">This.includes</span>() {<br />
    &nbsp;&nbsp;<span class="function">combining</span>(<span class="property">physical_digital_experiences</span>,<span class="property"> product_strategy</span>,<span class="property"> project management</span>);<br />
    &nbsp;&nbsp;<span class="keyword">while</span> (<span class="string">"I'm"</span>!= <span class="string">"software_engineer"</span>) {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;I do have <span class="keyword">var</span> skills = [<span class="string"><i class="fab fa-unity"></i> Unity</span>,<span class="string"> <i class="fab fa-node-js"></i> Node.js</span>,<span class="string"> <i class="fas fa-database"></i> SQL</span>];<br />
    }
      `,
    },
  };

  function switchAudience(audience) {
    const data = audienceData[audience];

    audienceButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.audience === audience);
    });

    sectionBottom.className = `landing-section-bottom ${data.theme}`;

    dynamicText.style.opacity = 0;

    setTimeout(() => {
      dynamicText.innerHTML = data.text;
      dynamicText.style.opacity = 1;

      // Update background image via CSS custom property on the background element
      sectionBackground.style.setProperty(
        "--background-image",
        `url('${data.image}')`,
      );

      // ResizeObserver will automatically trigger ScrollTrigger.refresh()
      // when the section height changes
    }, 200);
  }

  audienceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchAudience(button.dataset.audience);
    });
  });

  switchAudience("anyone");
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
