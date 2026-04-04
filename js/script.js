document.addEventListener("DOMContentLoaded", (event) => {
  const name = ".name>div";
  const heroImg = ".hero_img_container>img";
  gsap.set([name, heroImg], { visibility: "visible" });

  const tl = gsap.timeline();
  // the -=0.8 provides overlap, so 2nd anim for e.g. plays
  // 0.2s after 1st anim
  // < means start right after previous anim started
  // > means start right after previous anim ended (default behavior)

  tl.from(name, {
    yPercent: 150,
    duration: 1,
    ease: "circ.out",
  }).from(
    heroImg,
    {
      yPercent: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=1.4",
  );
});
