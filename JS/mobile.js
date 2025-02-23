window.addEventListener("sectionsLoaded", (event) => {
  if (event.detail.isMobile) {
    initializeVideoScrollTrigger();
    videoplayerFunctions();
    videoScrollerPlay();
    animateClasses();
    initializeGallery();
    initializeTestimonialAnimation();
  }
});

function initializeVideoScrollTrigger() {
  const video = document.getElementById("DigitalEmpowermentVideo");
  if (!video) return;

  ScrollTrigger.create({
    trigger: video,
    start: "top center",
    end: "bottom center",
    onEnter: () => video.play(),
    onLeave: () => video.pause(),
    onEnterBack: () => video.play(),
    onLeaveBack: () => video.pause(),
  });
}

function videoplayerFunctions() {
  const video = document.getElementById("DigitalEmpowermentVideo");
  const videoContainer = document.querySelector(".videoplayer-container");

  video.addEventListener("pause", () => {
    videoContainer.classList.remove("playing");
  });

  video.addEventListener("play", () => {
    videoContainer.classList.add("playing");
    document
      .querySelector(".project-description")
      .classList.add("video-playing");
  });

  video.addEventListener("pause", () => {
    videoContainer.classList.remove("playing");
    document
      .querySelector(".project-description")
      .classList.remove("video-playing");
  });
}

function videoScrollerPlay() {
  let video = document.getElementById("scroll-video");
  video.addEventListener("loadeddata", () => {
    video.pause();

    let scrollTrigger = ScrollTrigger.create({
      trigger: ".video-scroll-player-container",
      start: "top bottom",
      end: "top 0",
      scrub: 1,
      onUpdate: (self) => {
        let progress = self.progress;
        video.currentTime = progress * video.duration;
      },
    });
  });
}

function animateClasses() {
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
    }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

function initializeGallery() {
  const featuredImage = document.getElementById("featuredImage");
  const thumbnails = document.querySelectorAll(
    ".thumbnail-gallery .gallery-item img"
  );

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      featuredImage.src = thumbnail.src;
      thumbnails.forEach((thumb) =>
        thumb.parentElement.classList.remove("active")
      );
      thumbnail.parentElement.classList.add("active");
    });
  });
}

function initializeScrollerContent(scroller, index) {
  const scrollerInner = scroller.querySelector(".testimonials-scroller-inner");
  if (!scrollerInner) return;

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

function initializeTestimonialAnimation() {
  const scrollers = document.querySelectorAll(".testimonials-scroller");

  scrollers.forEach((scroller, index) => {
    const direction = index === 1 ? "right" : "left";
    scroller.setAttribute("data-direction", direction);
    scroller.setAttribute("data-animated", true);

    initializeScrollerContent(scroller, index);
  });
}
