gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  const name = ".name>div";
  const heroImg = ".hero-img-container>img";
  const jobTitle = ".job-title>div";
  const altTitles = ".alt-titles>div";
  const location = ".location>div";
  const pill = ".pill";
  const hero = ".hero";
  const body = "body";
  const aboutTrans = ".about-transition-text";
  gsap.set([name, heroImg, jobTitle, altTitles, location, pill, aboutTrans], {
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
      [altTitles, aboutTrans],
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

  const scrubTl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      scrub: 1,
      start: "center center",
      markers: true,
    },
  });

  //   scrubTl.from(aboutTrans, { y:-100 });
});
