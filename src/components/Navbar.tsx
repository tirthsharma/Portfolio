import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export interface CustomSmoother {
  paused: (state?: boolean) => boolean | void;
  scrollTo: (target: string | Element | null, smooth?: boolean, position?: string) => void;
  scrollTop: (val?: number) => number | void;
}

export const smoother: CustomSmoother = {
  paused: () => {},
  scrollTo: (target) => {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (target instanceof Element) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  },
  scrollTop: (val) => {
    if (typeof val === "number") {
      window.scrollTo({ top: val, behavior: "instant" as ScrollBehavior });
    }
    return window.scrollY;
  },
};

const Navbar = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("tirthsharmabusiness@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        e.preventDefault();
        let elem = e.currentTarget as HTMLAnchorElement;
        let section = elem.getAttribute("data-href");
        if (section) {
          smoother.scrollTo(section);
        }
      });
    });
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <span className="navbar-brand-badge">T</span>
          <span className="navbar-brand-name">
            ImTirt<span className="brand-h1">h</span><span className="brand-h2">h</span>
          </span>
        </a>
        <button
          onClick={copyEmail}
          className="navbar-connect"
          data-cursor="disable"
          title="Click to copy email"
        >
          {copied ? "✓ Copied to clipboard!" : "tirthsharmabusiness@gmail.com"}
        </button>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
