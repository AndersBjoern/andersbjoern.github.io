const MOBILE = 900;
const QUERYSELECTOR = "main section";
let initialWidth = window.innerWidth;

async function loadSectionContent(section, url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    section.innerHTML = html;
  } catch (error) {
    console.error(error);
    section.innerHTML = "<p>Error loading content</p>";
  }
}

async function loadSections(forceReloadSpecificOnly = false) {
  const isMobile = window.innerWidth <= MOBILE;
  const sections = document.querySelectorAll(QUERYSELECTOR);
  const loadPromises = [];

  sections.forEach((section) => {
    const type = section.dataset.type;
    let src = null;

    if (type === "common" && !forceReloadSpecificOnly) {
      src = section.dataset.src;
    } else if (type === "specific") {
      if (isMobile && section.dataset.mobile) {
        src = section.dataset.mobile;
      } else if (!isMobile && section.dataset.desktop) {
        src = section.dataset.desktop;
      }
    }

    if (src) {
      loadPromises.push(loadSectionContent(section, src));
    }
  });

  await Promise.all(loadPromises);

  const event = new CustomEvent("sectionsLoaded", { detail: { isMobile } });
  window.dispatchEvent(event);
}

function resetContentOnResize() {
  let currentWidth = window.innerWidth;
  if (
    (initialWidth <= MOBILE && currentWidth > MOBILE) ||
    (initialWidth > MOBILE && currentWidth <= MOBILE)
  ) {
    initialWidth = currentWidth;
    const main = document.querySelector("main");

    const preservedSections = Array.from(main.children).map(
      (child) => child.outerHTML
    );

    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    main.innerHTML = preservedSections.join("");

    loadSections();
  }
}

function init() {
  window.addEventListener("DOMContentLoaded", () => {
    loadSections();
  });

  window.addEventListener("resize", resetContentOnResize);
}

init();
