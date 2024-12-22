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

    const addTestimonialAnimation = () => {
      const scrollers = document.querySelectorAll(".testimonials-scroller");

      scrollers.forEach((scroller, index) => {
        const direction = index === 1 ? "right" : "left";
        scroller.setAttribute("data-direction", direction);

        scroller.setAttribute("data-animated", true);

        const scrollerInner = scroller.querySelector(
          ".testimonials-scroller-inner"
        );
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
      });
    };

    addTestimonialAnimation();
  }
});
