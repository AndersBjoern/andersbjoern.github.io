// STACR Interactive Content Switcher
class STACRController {
  constructor(projectArticle) {
    this.projectArticle = projectArticle;
    this.buttons = projectArticle.querySelectorAll(".stacr-button");
    this.contentArea = projectArticle.querySelector(".stacr-content-area");
    this.mediaArea = projectArticle.querySelector(".stacr-media-area");
    this.contents = {};
    this.media = {};

    // Parse content and media from data attributes
    this.parseContent();
    this.parseMedia();

    // Initialize first button as active
    if (this.buttons.length > 0) {
      this.switchContent(this.buttons[0].dataset.stacr);
    }

    // Bind click events
    this.bindEvents();
  }

  parseContent() {
    // Get all content sections
    const contentSections = this.projectArticle.querySelectorAll(
      "[data-stacr-content]",
    );

    contentSections.forEach((section) => {
      const key = section.dataset.stacrContent;
      this.contents[key] = section.innerHTML;
    });
  }

  parseMedia() {
    // Get all media sections
    const mediaSections =
      this.projectArticle.querySelectorAll("[data-stacr-media]");

    mediaSections.forEach((section) => {
      const key = section.dataset.stacrMedia;
      this.media[key] = section.innerHTML;
    });
  }

  bindEvents() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const contentKey = button.dataset.stacr;
        this.switchContent(contentKey);
      });
    });
  }

  switchContent(contentKey) {
    // Update active button
    this.buttons.forEach((btn) => {
      if (btn.dataset.stacr === contentKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Handle media-only layout
    const contentRow = this.projectArticle.querySelector(".stacr-content-row");
    if (contentKey === "media") {
      contentRow.classList.add("media-only");
      // Clear content area immediately for media button
      this.contentArea.innerHTML = "";
      this.contentArea.style.opacity = "0";
    } else {
      contentRow.classList.remove("media-only");

      // Update content with fade effect (only for non-media buttons)
      if (this.contents[contentKey]) {
        this.contentArea.style.opacity = "0";

        setTimeout(() => {
          this.contentArea.innerHTML = this.contents[contentKey];
          this.contentArea.style.opacity = "1";
        }, 200);
      }
    }

    // Update media with fade effect
    if (this.mediaArea) {
      this.mediaArea.style.opacity = "0";

      setTimeout(() => {
        if (this.media[contentKey]) {
          // Use the specific media for this category
          this.mediaArea.innerHTML = this.media[contentKey];
          this.mediaArea.classList.remove("empty");
        } else {
          // Use default media if available
          const defaultMedia = this.getDefaultMedia();
          if (defaultMedia) {
            this.mediaArea.innerHTML = defaultMedia;
            this.mediaArea.classList.remove("empty");
          } else {
            this.mediaArea.innerHTML = "";
            this.mediaArea.classList.add("empty");
          }
        }
        this.mediaArea.style.opacity = "1";
      }, 200);
    }
  }

  getDefaultMedia() {
    // Try to get default media from data-stacr-media="default"
    const defaultMediaSection = this.projectArticle.querySelector(
      '[data-stacr-media="default"]',
    );
    if (defaultMediaSection) {
      return defaultMediaSection.innerHTML;
    }

    // Otherwise, use the first available media
    const firstMediaKey = Object.keys(this.media)[0];
    if (firstMediaKey) {
      return this.media[firstMediaKey];
    }

    return null;
  }
}

// Initialize STACR controllers when sections are loaded
window.addEventListener("sectionsLoaded", () => {
  const projectArticles = document.querySelectorAll(".project-article");

  projectArticles.forEach((article) => {
    const stacrContainer = article.querySelector(".stacr-interactive-wrapper");
    if (stacrContainer) {
      new STACRController(article);
    }
  });
});
