gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//gsap timelines (scroll and time-based):
document.addEventListener("DOMContentLoaded", (event) => {
  const name = ".name>div";
  const heroImg = ".hero-img-container>img";
  const jobTitle = ".job-title>div";
  const altTitles = ".alt-titles>div";
  const location = ".location>div";
  const pill = ".pill>div";
  const transition = ".transition";
  const body = "body";
  const transitionText = ".transition-text";
  const featuredWork = ".work";
  const workGrid_1 = ".work-grid-1";

  gsap.set([name, heroImg, jobTitle, altTitles, location, pill], {
    visibility: "visible",
  });

  const tl = gsap.timeline();
  // the -=0.8 provides overlap, so 2nd anim for e.g. plays
  // 0.2s after 1st anim
  // < means start right after previous anim started
  // > means start right after previous anim ended (default behavior)

  tl.from(name, {
    yPercent: 150,
    duration: 1,
    ease: "circ.out",
  })
    .from(
      heroImg,
      {
        yPercent: 20,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      },
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

  // pill yoyo:
  const pillTl = gsap.timeline({
    repeat: -1,
    delay: 1,
  });

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
      trigger: transition,
      scrub: 1,
      start: "top bottom",
      end: "bottom bottom",
      invalidateOnRefresh: true,
    },
  });

  transitionScrubTl.to(transitionText, { yPercent: 100, ease: "none" });

  const featuredWorkTl = gsap.timeline({
    scrollTrigger: {
      trigger: featuredWork,
      start: "15% bottom",
      markers: true,
    },
  });

  featuredWorkTl.from(workGrid_1, {
    xPercent: -100,
    duration: 1,
    ease: "power4.inOut",
  });

  
  // smoother:
let smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,
});

let projectLink = document.querySelector(".project-link");
projectLink.addEventListener("click", () => {
  smoother.scrollTo(".work", true, "bottom bottom");
});

});

// scrollTrigger quirks:
function resizeInvisibleText() {
  const transitionTextElement = document.querySelector(".transition-text");
  const transitionTextInvisibleElement = document.querySelector(
    ".transition-text.invisible",
  );

  if (transitionTextElement && transitionTextInvisibleElement) {
    // need 2 do bc gsap transform messes up calculations:
    transitionTextElement.style.transform = "none";

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