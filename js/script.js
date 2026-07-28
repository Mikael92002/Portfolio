gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrollToPlugin);

let planeTimeline = null;
const contactSection = document.querySelector("#contact");

const SELECTORS = {
  name: ".name>div",
  heroImg: ".hero-img-container>img",
  jobTitle: ".job-title>div",
  altTitles: ".alt-titles>div",
  location: ".location>div",
  pill: ".pill",
  work: ".work",
  hero: ".hero",
  body: "body",
  transitionText: "#transition-text",
  transitionTextContainer: ".transition-text-container",
  invisibleTransition: ".transition-text.invisible",
  plane: ".plane",
  dash: ".dash",
};

function resizeInvisibleText() {
  const source = document.querySelector(SELECTORS.transitionText);
  const target = document.querySelector(SELECTORS.invisibleTransition);

  if (source && target) {
    const originalStyle = source.getAttribute("style") || "";

    source.style.transform = "none";
    source.style.opacity = "1";
    source.style.visibility = "visible";

    const rect = source.getBoundingClientRect();

    if (originalStyle) {
      source.setAttribute("style", originalStyle);
    } else {
      source.removeAttribute("style");
    }

    target.style.width = `${rect.width}px`;
    target.style.height = `${rect.height}px`;
  }
}

function initPlaneAnimation() {
  if (planeTimeline) {
    planeTimeline.kill();
  }

  const targetContainer = contactSection || document.querySelector("#contact");
  if (targetContainer) {
    targetContainer
      .querySelectorAll(SELECTORS.dash)
      .forEach((dash) => dash.remove());
  }

  gsap.set(SELECTORS.plane, {
    position: "absolute",
    top: 0,
    left: 0,
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "50% 50%",
  });

  const pathArr = [
    { x: 0, y: 0 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
    { x: window.innerWidth * 0.45, y: window.innerHeight * 0.25 },
    { x: window.innerWidth * 0.35, y: window.innerHeight * 0.5 },
    { x: window.innerWidth + 20, y: window.innerHeight * 0.35 },
  ];

  const duration = 10;
  const spawnInterval = 0.15;
  const totalDashes = Math.floor(duration / spawnInterval);

  const delay = 0.15;
  const progressDelay = delay / duration;

  const rawPath = MotionPathPlugin.arrayToRawPath(pathArr);
  MotionPathPlugin.cacheRawPathMeasurements(rawPath);

  const dashes = [];

  for (let i = 1; i <= totalDashes; i++) {
    const progress = i / totalDashes;
    const point = MotionPathPlugin.getPositionOnPath(rawPath, progress, true);

    const dash = document.createElement("div");
    dash.classList.add("dash");

    gsap.set(dash, {
      x: point.x,
      y: point.y,
      rotation: point.angle,
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "50% 50%",
    });
    dash.style.visibility = "hidden";

    if (targetContainer) {
      targetContainer.append(dash);
    }

    dashes.push({
      element: dash,
      progress: progress,
    });
  }

  planeTimeline = gsap.timeline().to(SELECTORS.plane, {
    duration: 10,
    repeat: 0,
    ease: "none",
    motionPath: {
      path: pathArr,
      autoRotate: true,
      alignOrigin: [0.5, 0.5],
    },
    onUpdate: () => {
      const currentProgress = planeTimeline.progress();
      const isAtEnd = currentProgress >= 0.999;

      dashes.forEach((dash) => {
        dash.element.style.visibility =
          isAtEnd || currentProgress >= dash.progress + progressDelay
            ? "visible"
            : "hidden";
      });
    },
    onComplete: () => {
      const interval = setInterval(() => {
        if (dashes.length > 0) {
          dashes.shift().element.remove();
        } else {
          clearInterval(interval);
        }
      }, 100);
    },
  });
}

function initHeroIntro() {
  gsap.set(
    [
      SELECTORS.name,
      SELECTORS.heroImg,
      SELECTORS.jobTitle,
      SELECTORS.altTitles,
      SELECTORS.location,
      SELECTORS.pill,
    ],
    {
      visibility: "visible",
    },
  );

  gsap
    .timeline()
    .from(SELECTORS.name, { yPercent: 150, duration: 1, ease: "circ.out" })
    .from(
      SELECTORS.heroImg,
      { yPercent: 20, opacity: 0, duration: 1.5, ease: "power4.out" },
      "<",
    )
    .from(
      [SELECTORS.altTitles, SELECTORS.transitionTextContainer],
      { xPercent: -100, opacity: 0, duration: 1 },
      "<",
    )
    .from(SELECTORS.location, { xPercent: 100, opacity: 0, duration: 1 }, "<")
    .from(SELECTORS.pill, { opacity: 0, duration: 1 }, "<")
    .from(SELECTORS.jobTitle, { opacity: 0, duration: 0.5 }, ">");
}

function initPillAnimations() {
  const loopPill = gsap
    .timeline({ repeat: 3 })
    .to(SELECTORS.pill, { rotation: 20, ease: "power1.inOut", duration: 0.2 })
    .to(SELECTORS.pill, { rotation: -20, ease: "power1.inOut", duration: 0.2 });

  gsap
    .timeline({ repeat: -1, delay: 1 })
    .to(SELECTORS.pill, { scale: 1.2, duration: 0.5, ease: "power3.inOut" })
    .add(loopPill, "-=0.5")
    .to(
      SELECTORS.pill,
      { scale: 1, duration: 0.5, ease: "power3.inOut" },
      "-=0.5",
    )
    .to(SELECTORS.pill, { duration: 4 });
}

function initTransitionScrub() {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: SELECTORS.hero,
        scrub: 1,
        start: "bottom bottom",
        end: "190% bottom",
        onLeave: () =>
          gsap.to(SELECTORS.transitionText, {
            autoAlpha: 0,
            duration: 0.2,
            overwrite: "auto",
          }),
        onEnterBack: () =>
          gsap.to(SELECTORS.transitionText, {
            autoAlpha: 1,
            duration: 0.2,
            overwrite: "auto",
          }),
      },
    })
    .fromTo(
      SELECTORS.transitionText,
      { yPercent: 0 },
      { yPercent: 100, ease: "none" },
    );
}

function initAnchorScrolls() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = anchor.getAttribute("href");
      if (target === "#") return;

      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: target,
          offsetY: 60,
        },
        ease: "power1.inOut",
        autoKill: true,
      });
    });
  });
}

function handleGlobalRevert() {
  resizeInvisibleText();
}

function handleGlobalRefresh() {
  if (planeTimeline) {
    const currentProgress = planeTimeline.progress();
    planeTimeline.getChildren().forEach((tween) => {
      const targetsArr = tween.targets();
      targetsArr.forEach((target) => {
        gsap.set(target, { clearProps: "transform" });
      });
    });
    initPlaneAnimation();
    planeTimeline.progress(currentProgress);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroIntro();
  initPillAnimations();
  initPlaneAnimation();
  initAnchorScrolls();
});

window.addEventListener("load", () => {
  resizeInvisibleText();
  initTransitionScrub();
  ScrollTrigger.addEventListener("revert", handleGlobalRevert);
  ScrollTrigger.addEventListener("refresh", handleGlobalRefresh);
});

function destroyAnimations() {
  ScrollTrigger.removeEventListener("revert", handleGlobalRevert);
  ScrollTrigger.removeEventListener("refresh", handleGlobalRefresh);
  if (planeTimeline) planeTimeline.kill();
}
