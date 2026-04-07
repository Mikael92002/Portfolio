gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//gsap timelines (scroll and time-based):
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
  // const workGrid_1 = ".work-grid-1";

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
      trigger: work,
      scrub: 1,
      start: "top bottom",
      end: "bottom bottom ",
      invalidateOnRefresh: true,
      onLeave: () => {
        gsap.to(transitionText, {
          autoAlpha: 0,
          duration: 1,
          overwrite: "auto",
        });
        gsap.to(featuredWorkHeading, { autoAlpha: 1, duration: 1 });
      },
      onEnterBack: () => {
        gsap.to(transitionText, {
          autoAlpha: 1,
          duration: 1,
          overwrite: "auto",
        });
        gsap.to(featuredWorkHeading, { autoAlpha: 0, duration: 1 });
      },
    },
  });

  transitionScrubTl.to(transitionText, { yPercent: 100, ease: "none" });

  const featuredWorkPinnedTl = gsap.timeline({
    scrollTrigger: {
      trigger: work,
      pin: true,
    },
  });
});

// scrollTrigger quirks:
function resizeInvisibleText() {
  const transitionTextElement = document.querySelector("#transition-text");
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
