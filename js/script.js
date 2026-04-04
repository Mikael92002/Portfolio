gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", (event) => {
  const name = ".name>div";
  const heroImg = ".hero_img_container>img";
  const jobTitle = ".job-title>div";
  const facts = ".alt-titles>div";
  gsap.set([name, heroImg, jobTitle, facts], { visibility: "visible" });

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
    .from(facts, { xPercent: -100, opacity: 0, duration: 1 }, "<")
    .from(jobTitle, { opacity: 0, duration: 0.5 }, ">");
});
