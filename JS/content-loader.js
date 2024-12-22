const MOBILE = 900;
const QUERYSELECTOR = "main section";

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
      // Load common sections only if full reload is required
      src = section.dataset.src;
    } else if (type === "specific") {
      // Always determine specific sections based on current view (mobile/desktop)
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

  // Log før eventen bliver afsendt
  const event = new CustomEvent("sectionsLoaded", { detail: { isMobile } });
  window.dispatchEvent(event);
}

function init() {
  window.addEventListener("DOMContentLoaded", () => {
    loadSections(); // Initial load
  });
}

init();
