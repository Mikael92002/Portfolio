gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

let featuredWorkScrollTrigger = null;
let featuredWorkTimeline = null;
let planeTween = null;

const SELECTORS = {
  name: ".name>div",
  heroImg: ".hero-img-container>img",
  jobTitle: ".job-title>div",
  altTitles: ".alt-titles>div",
  location: ".location>div",
  pill: ".pill",
  work: ".work",
  body: "body",
  transitionText: "#transition-text",
  invisibleTransition: ".transition-text.invisible",
  projectContainer: ".project-container",
  plane: ".plane",
};

function getScrollWidth() {
  const container = document.querySelector(SELECTORS.projectContainer);
  if (!container) return 0;
  const scrollDistance = container.offsetWidth - window.innerWidth;
  return scrollDistance > 0 ? scrollDistance : 0;
}

function resizeInvisibleText() {
  const source = document.querySelector(SELECTORS.transitionText);
  const target = document.querySelector(SELECTORS.invisibleTransition);
  
  if (source && target) {
    const rect = source.getBoundingClientRect();
    target.style.width = `${rect.width}px`;
    target.style.height = `${rect.height}px`;
  }
}

function initFeaturedWorkScroll() {
  if (featuredWorkScrollTrigger) featuredWorkScrollTrigger.kill();
  if (featuredWorkTimeline) featuredWorkTimeline.kill();

  const projectContainer = document.querySelector(SELECTORS.projectContainer);
  const scrollDistance = getScrollWidth();

  if (!projectContainer || scrollDistance <= 0) return;

  featuredWorkTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: SELECTORS.work,
      pin: true,
      pinSpacing: true,
      start: "top 60px",
      end: () => `+=${getScrollWidth()}`,
      scrub: 1,
      invalidateOnRefresh: true, 
    },
  });

  featuredWorkTimeline.to(projectContainer, {
    x: () => -getScrollWidth(),
    ease: "none",
  });

  featuredWorkScrollTrigger = featuredWorkTimeline.scrollTrigger;
}

function initPlaneAnimation() {
  if (planeTween) {
    planeTween.kill();
  }

  planeTween = gsap.to(SELECTORS.plane, {
    duration: 5,
    repeat: -1,
    ease: "none",
    motionPath: {
      path: () => [
        { x: 0, y: 0 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
        { x: window.innerWidth * 0.45, y: window.innerHeight * 0.25 },
        { x: window.innerWidth, y: window.innerHeight * 0.35 }
      ],
      autoRotate: true,
    }
  });
}

function initHeroIntro() {
  gsap.set([SELECTORS.name, SELECTORS.heroImg, SELECTORS.jobTitle, SELECTORS.altTitles, SELECTORS.location, SELECTORS.pill], {
    visibility: "visible",
  });

  gsap.timeline()
    .from(SELECTORS.name, { yPercent: 150, duration: 1, ease: "circ.out" })
    .from(SELECTORS.heroImg, { yPercent: 20, opacity: 0, duration: 1.5, ease: "power4.out" }, "<")
    .from([SELECTORS.altTitles, SELECTORS.transitionText], { xPercent: -100, opacity: 0, duration: 1 }, "<")
    .from(SELECTORS.location, { xPercent: 100, opacity: 0, duration: 1 }, "<")
    .from(SELECTORS.pill, { opacity: 0, duration: 1 }, "<")
    .from(SELECTORS.jobTitle, { opacity: 0, duration: 0.5 }, ">");
}

function initPillAnimations() {
  const loopPill = gsap.timeline({ repeat: 3 })
    .to(SELECTORS.pill, { rotation: 20, ease: "power1.inOut", duration: 0.2 })
    .to(SELECTORS.pill, { rotation: -20, ease: "power1.inOut", duration: 0.2 });

  gsap.timeline({ repeat: -1, delay: 1 })
    .to(SELECTORS.pill, { scale: 1.2, duration: 0.5, ease: "power3.inOut" })
    .add(loopPill, "-=0.5")
    .to(SELECTORS.pill, { scale: 1, duration: 0.5, ease: "power3.inOut" }, "-=0.5")
    .to(SELECTORS.pill, { duration: 4 });
}

function initTransitionScrub() {
  gsap.timeline({
    scrollTrigger: {
      trigger: SELECTORS.work,
      scrub: 1,
      start: "top bottom",
      end: "75% bottom",
      invalidateOnRefresh: true,
      onLeave: () => gsap.to(SELECTORS.transitionText, { autoAlpha: 0, duration: 0.2, overwrite: "auto" }),
      onEnterBack: () => gsap.to(SELECTORS.transitionText, { autoAlpha: 1, duration: 0.2, overwrite: "auto" }),
    },
  }).to(SELECTORS.transitionText, { yPercent: 100, ease: "none" });
}

function handleGlobalLayoutSync() {
  resizeInvisibleText();
  initFeaturedWorkScroll();
  
  if (planeTween) {
    const currentProgress = planeTween.progress();
    gsap.set(SELECTORS.plane, { clearProps: "transform" });
    initPlaneAnimation();
    planeTween.progress(currentProgress);
  }
}

function destroyAnimations() {
  window.removeEventListener("resize", handleGlobalLayoutSync);
  ScrollTrigger.removeEventListener("refreshInit", handleGlobalLayoutSync);
  if (featuredWorkScrollTrigger) featuredWorkScrollTrigger.kill();
  if (featuredWorkTimeline) featuredWorkTimeline.kill();
  if (planeTween) planeTween.kill();
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroIntro();
  initPillAnimations();
  initTransitionScrub();
  initFeaturedWorkScroll();
  initPlaneAnimation();
});

window.addEventListener("load", () => {
  resizeInvisibleText();
  
  ScrollTrigger.addEventListener("refreshInit", handleGlobalLayoutSync);
  window.addEventListener("resize", handleGlobalLayoutSync);
});