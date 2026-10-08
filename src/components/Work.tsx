import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(useGSAP);

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tools: string;
  video?: string;
  image?: string;
  aspectRatio?: "horizontal" | "vertical";
  link?: string;
}

export const MORE_PROJECTS_DRIVE_LINK =
  "https://drive.google.com/drive/folders/1FDdBFZKhsOKSWh9UN0D9tjVLydKeIUy3?usp=sharing";

const projects: ProjectItem[] = [
  {
    id: "01",
    number: "01",
    title: "Meet marvin",
    category: "3d Motion design",
    tools: "Blender, Aftereffects",
    video: "/videos/portfolio-video-1.mp4",
    aspectRatio: "horizontal",
  },
  {
    id: "02",
    number: "02",
    title: "Personal project",
    category: "3d motion design",
    tools: "Blender, Aftereffects",
    video: "/videos/vertical-3d-motion.mp4",
    aspectRatio: "vertical",
  },
  {
    id: "03",
    number: "03",
    title: "Google Workspace",
    category: "saas video",
    tools: "Aftereffects, Davinci Resolve",
    video: "/videos/portfolio-video-2.mp4",
    image: "/images/google-workspace-poster.jpeg",
    aspectRatio: "horizontal",
  },
  {
    id: "04",
    number: "04",
    title: "Sony camera",
    category: "3D Motion design",
    tools: "Blender, Aftereffects",
    video: "/videos/vertical-sony-camera.mp4",
    aspectRatio: "vertical",
  },
  {
    id: "05",
    number: "05",
    title: "ByChance",
    category: "Motion graphic video",
    tools: "Aftereffects, Davinci Resolve",
    video: "/videos/portfolio-video-3.mp4",
    aspectRatio: "horizontal",
  },
  {
    id: "06",
    number: "06",
    title: "Motion Graphic",
    category: "kinetic typography",
    tools: "Aftereffects, Davinci Resolve",
    video: "/videos/kinetic-typography-reel.mp4",
    aspectRatio: "vertical",
  },
];

const Work = () => {
  useGSAP(() => {
    function getTranslateX() {
      const section = document.querySelector(".work-section") as HTMLElement;
      const container = section?.querySelector(".work-container") as HTMLElement;
      const row = section?.querySelector(".work-flex") as HTMLElement;
      if (!section || !container || !row) return 0;
      const lastCard = row.lastElementChild as HTMLElement;
      if (!lastCard) return 0;
      const rowMarginLeft = parseFloat(window.getComputedStyle(row).marginLeft) || 0;

      return Math.max(
        0,
        lastCard.offsetLeft + lastCard.offsetWidth + rowMarginLeft - container.clientWidth
      );
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${getTranslateX()}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: () => -getTranslateX(),
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header">
          <h2>
            My <span>Work</span>
          </h2>
          <a
            href={MORE_PROJECTS_DRIVE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="work-drive-btn"
          >
            More Projects <MdArrowOutward />
          </a>
        </div>
        <div className="work-flex">
          {projects.map((project) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>

                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage
                video={project.video}
                image={project.image}
                aspectRatio={project.aspectRatio}
                alt={project.title}
                link={project.link}
              />
            </div>
          ))}

          {/* More Projects Card at the end of the reel */}
          <div className="work-box work-more-card">
            <div className="work-more-card-inner">
              <div className="work-more-badge">
                <MdArrowOutward />
              </div>
              <h3>Explore More Work</h3>
              <p>
                Browse the full archive of client projects, commercial edits,
                3D animations, and social reels on Google Drive.
              </p>
              <a
                href={MORE_PROJECTS_DRIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="work-more-cta"
              >
                Open Google Drive <MdArrowOutward />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
