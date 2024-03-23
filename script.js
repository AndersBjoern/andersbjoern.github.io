const races = document.querySelector(".Horizontal-container");

function getScrollAmount() {
	let racesWidth = races.scrollWidth;
	return -(racesWidth - window.innerWidth);
}

const tween = gsap.to(races, {
	x: getScrollAmount,
	duration: 3,
	ease: "none",
});

const root = document.documentElement;
const contrastColor = getComputedStyle(root).getPropertyValue('--contrast-color');

ScrollTrigger.create({
	trigger:".Horizontal",
	start:"top 0%",
	end: () => `+=${getScrollAmount() * -1}`,
	pin:true,
	animation:tween,
	scrub:1,
	invalidateOnRefresh:true,
	onEnter: () => {
        gsap.to(races, { background: `linear-gradient(90deg, rgba(2,0,36,0.695203081232493) 24%, rgba(21,9,100,1) 50%, ${contrastColor} 84%)`, duration: 0.5 });
    },
    onLeaveBack: () => {
        gsap.to(races, { background: "none", duration: 0.5 });
    }
})


const addAnimation = () => {
	scrollers.forEach(scroller=> {
		scroller.setAttribute("data-animated", true)

		const scrollerInner = scroller.querySelector(".scroller_inner");
		const scrollerContent = Array.from(scrollerInner.children);

		scrollerContent.forEach(item => {
			const duplicatedItem = item.cloneNode(true);
			duplicatedItem.setAttribute("aria-hidden", true);
			scrollerInner.appendChild(duplicatedItem);
		})
	});
}
const scrollers = document.querySelectorAll(".scroller");
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	addAnimation();
}

const skillsSection = document.querySelector('.Skills');
const blackBackground = document.querySelector('.black-background');
const body = document.body;

// Opret en ScrollTrigger
ScrollTrigger.create({
	trigger: skillsSection,
	start: "top 10%", // Justér dette efter dine behov
	end: "bottom center", // Justér dette efter dine behov
	onEnter: () => {
		// Animation, når sektionen er i visning
		gsap.to(body, { backgroundColor: "white", duration: 1 });
		gsap.to(body, { color: "black", duration: 1 });
		gsap.to(blackBackground, { 
			color: "white",
			width: "90vw", 
			height: "80vh", 
			top:"5vh", 
			borderTopRightRadius: "40px", 
			borderBottomRightRadius: "40px", 
			duration: 1 });
	},
	onLeaveBack: () => {
		// Animation, når sektionen forlader visning
		gsap.to(body, { backgroundColor: "black", duration: 1 });
		gsap.to(body, { color: "white", duration: 1 });
		gsap.to(blackBackground, { 
			color: "black",
			width: "100vw", 
			height: "100vh", 
			top:"0", 
			borderTopRightRadius: "0", 
			borderBottomRightRadius: "0", 
			duration: 1 });
	}
});