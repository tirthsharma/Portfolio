import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import { SplitText } from "gsap-trial/SplitText";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });

  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.kill();
      para.split?.revert();
    }

    para.split = new SplitText(para, {
      type: "words",
      wordsClass: "split-word",
    });

    // Baseline: "text behind text" is visible at dimmed opacity
    gsap.set(para.split.words, {
      color: "rgba(255, 255, 255, 0.22)",
      opacity: 0.22,
    });

    // Scroll-driven highlighting: words progressively illuminate to white
    para.anim = gsap.to(para.split.words, {
      color: "#ffffff",
      opacity: 1,
      stagger: 0.1,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 70%",
        end: "center 40%",
        scrub: 0.6,
      },
    });
  });

  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new SplitText(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title,
          toggleActions: "play pause resume reverse",
          start: "top 85%",
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });
}
