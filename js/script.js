document.addEventListener("DOMContentLoaded", (event) => {
  const firstName = ".first_name>div";
  const lastName = ".last_name>div";
  const intro = ".intro>div";
  const heroImg = ".hero_img_container>img";
  gsap.set([firstName, lastName, intro, heroImg], { visibility: "visible" });

  const tl = gsap.timeline();
  // the -=0.8 provides overlap, so 2nd anim for e.g. plays
  // 0.2s after 1st anim
  // < means start right after previous anim started
  // > means start right after previous anim ended (default behavior)
  
  tl.from(firstName, { xPercent: -125, duration: 1, ease: "circ.out" })
    .from(lastName, { yPercent: 100, duration: 1, ease: "circ.out" }, "-=0.8")
    .from(intro, { yPercent: -100, duration: 1 }, "-=0.8")
    .from(
      heroImg,
      {
        xPercent: 20,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
      },
      "-=1",
    );
});
