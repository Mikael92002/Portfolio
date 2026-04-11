gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

let featuredWorkScrollTrigger = null;
let featuredWorkTimeline = null;

function getScrollWidth() {
  const projectContainer = document.querySelector(".project-container");
  if (!projectContainer) return 0;
  const scrollDistance = projectContainer.offsetWidth - window.innerWidth;
  return scrollDistance > 0 ? scrollDistance : 0;
}

function initFeaturedWorkScroll() {
  if (featuredWorkScrollTrigger) {
    featuredWorkScrollTrigger.kill();
    featuredWorkScrollTrigger = null;
  }
  if (featuredWorkTimeline) {
    featuredWorkTimeline.kill();
    featuredWorkTimeline = null;
  }

  const projectContainer = document.querySelector(".project-container");
  if (!projectContainer) return;

  const scrollDistance = getScrollWidth();

  if (scrollDistance <= 0) return;

  featuredWorkTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work",
      pin: true,
      pinSpacing: true,
      start: "top 60px",
      end: () => `+=${scrollDistance}`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  featuredWorkTimeline.to(projectContainer, {
    x: -scrollDistance,
    ease: "none",
  });

  featuredWorkScrollTrigger = featuredWorkTimeline.scrollTrigger;
}

function handleResize() {
  initFeaturedWorkScroll();
  ScrollTrigger.refresh();
}

document.addEventListener("DOMContentLoaded", (event) => {
  const name = ".name>div";
  const heroImg = ".hero-img-container>img";
  const jobTitle = ".job-title>div";
  const altTitles = ".alt-titles>div";
  const location = ".location>div";
  const pill = ".pill>div";
  const work = ".work";
  const invisibleTransition = ".transition-text.invisible";
  const body = "body";
  const transitionText = "#transition-text";
  const featuredWorkHeading = ".featured-work-h1";

  gsap.set([name, heroImg, jobTitle, altTitles, location, pill], {
    visibility: "visible",
  });

  const tl = gsap.timeline();
  tl.from(name, { yPercent: 150, duration: 1, ease: "circ.out" })
    .from(
      heroImg,
      { yPercent: 20, opacity: 0, duration: 1.5, ease: "power4.out" },
      "<",
    )
    .from(
      [altTitles, transitionText],
      { xPercent: -100, opacity: 0, duration: 1 },
      "<",
    )
    .from(location, { xPercent: 100, opacity: 0, duration: 1 }, "<")
    .from(pill, { opacity: 0, duration: 1 }, "<")
    .from(jobTitle, { opacity: 0, duration: 0.5 }, ">");

  const pillTl = gsap.timeline({ repeat: -1, delay: 1 });
  const loopPill = gsap.timeline({ repeat: 3 });
  loopPill
    .to(pill, { rotation: 20, ease: "power1.inOut", duration: 0.2 })
    .to(pill, { rotation: -20, ease: "power1.inOut", duration: 0.2 });
  pillTl
    .to(pill, { scale: 1.2, duration: 0.5, ease: "power3.inOut" })
    .add(loopPill, "-=0.5")
    .to(pill, { scale: 1, duration: 0.5, ease: "power3.inOut" }, "-=0.5")
    .to(pill, { duration: 4 });

  const transitionScrubTl = gsap.timeline({
    scrollTrigger: {
      trigger: work,
      scrub: 1,
      start: "top bottom",
      end: "75% bottom",
      invalidateOnRefresh: true,
      onLeave: () => {
        gsap.to(transitionText, {
          autoAlpha: 0,
          duration: 0.2,
          overwrite: "auto",
        });
      },
      onEnterBack: () => {
        gsap.to(transitionText, {
          autoAlpha: 1,
          duration: 0.2,
          overwrite: "auto",
        });
      },
    },
  });
  transitionScrubTl.to(transitionText, { yPercent: 100, ease: "none" });

  initFeaturedWorkScroll();

  window.addEventListener("resize", handleResize);
});

function resizeInvisibleText() {
  const transitionTextElement = document.querySelector("#transition-text");
  const transitionTextInvisibleElement = document.querySelector(
    ".transition-text.invisible",
  );
  if (transitionTextElement && transitionTextInvisibleElement) {
    transitionTextInvisibleElement.style.width = window.getComputedStyle(
      transitionTextElement,
    ).width;
    transitionTextInvisibleElement.style.height = window.getComputedStyle(
      transitionTextElement,
    ).height;
    ScrollTrigger.refresh();
  }
}

window.addEventListener("load", resizeInvisibleText);
window.addEventListener("resize", resizeInvisibleText);


const planeImg = document.querySelector(".plane>img");
console.log(planeImg.offsetWidth)
gsap.to(".plane>img", {
  motionPath: {
    path: [
      // { x: 100, y: 50 },
      // { x: 200, y: 0 },
      { x: window.innerWidth-planeImg.offsetWidth, y: 100 },
    ],
    alignOrigin: [0.5, 0.5],
    autoRotate: true,
  },
  transformOrigin: "50% 50%",
  duration: 5,
  ease: "power1.inOut",
});
