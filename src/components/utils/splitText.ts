import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function resolveElements(
  target: string | Element | (string | Element)[] | NodeListOf<Element>
): HTMLElement[] {
  if (!target) return [];
  if (typeof target === "string") {
    return Array.from(document.querySelectorAll<HTMLElement>(target));
  }
  if (target instanceof HTMLElement) {
    return [target];
  }
  if (Array.isArray(target)) {
    const list: HTMLElement[] = [];
    target.forEach((item) => {
      if (typeof item === "string") {
        list.push(...Array.from(document.querySelectorAll<HTMLElement>(item)));
      } else if (item instanceof HTMLElement) {
        list.push(item);
      }
    });
    return list;
  }
  if ("length" in (target as NodeListOf<HTMLElement>)) {
    return Array.from(target as NodeListOf<HTMLElement>);
  }
  return [];
}

export class SplitText {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  private originals: { element: HTMLElement; html: string }[] = [];

  constructor(
    target: string | Element | (string | Element)[] | NodeListOf<Element>,
    options: { type?: string; wordsClass?: string; linesClass?: string } = {}
  ) {
    const elements = resolveElements(target);
    const type = options.type || "chars";
    const wordsClass = options.wordsClass || "split-word";

    elements.forEach((el) => {
      this.originals.push({ element: el, html: el.innerHTML });
      this.splitNode(el, type, wordsClass);
    });
  }

  private splitNode(root: HTMLElement, type: string, wordsClass: string) {
    const doChars = type.includes("chars");
    const doWords = type.includes("words") && !doChars;

    const textNodes: Text[] = [];
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.trim().length > 0) {
          textNodes.push(node as Text);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(root);

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || "";
      const parent = textNode.parentNode;
      if (!parent) return;

      const fragment = document.createDocumentFragment();

      if (doChars) {
        const tokens = text.split(/(\s+)/);
        tokens.forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else {
            const wordContainer = document.createElement("span");
            wordContainer.style.display = "inline-block";
            wordContainer.style.whiteSpace = "nowrap";

            for (const ch of token) {
              const charSpan = document.createElement("span");
              charSpan.className = "split-char";
              charSpan.style.display = "inline-block";
              charSpan.textContent = ch;
              wordContainer.appendChild(charSpan);
              this.chars.push(charSpan);
            }
            fragment.appendChild(wordContainer);
          }
        });
      } else if (doWords) {
        const tokens = text.split(/(\s+)/);
        tokens.forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else {
            const wordSpan = document.createElement("span");
            wordSpan.className = wordsClass;
            wordSpan.style.display = "inline-block";
            wordSpan.textContent = token;
            fragment.appendChild(wordSpan);
            this.words.push(wordSpan);
          }
        });
      }

      parent.replaceChild(fragment, textNode);
    });
  }

  revert() {
    this.originals.forEach(({ element, html }) => {
      element.innerHTML = html;
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

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
