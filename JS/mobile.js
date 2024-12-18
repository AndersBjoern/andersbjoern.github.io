window.addEventListener("sectionsLoaded", (event) => {
  if (event.detail.isMobile) {
    let video = document.getElementById("DigitalEmpowermentVideo");

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
});
