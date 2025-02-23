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
  const playIcon = document.getElementById("playIcon");
  const videoContainer = document.querySelector(".videoplayer-container");

  playIcon.addEventListener("click", () => {
    video.play();
    videoContainer.classList.add("playing");
  });

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
  const animatedClasses = [".fade-effect"];

  animatedClasses.forEach((cls) => {
    const elements = gsap.utils.toArray(cls);

    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "bottom 10%",

            toggleActions: "play reverse play reverse",
          },
        }
      );
    });
  });
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
