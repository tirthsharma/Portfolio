import { useState, useRef } from "react";
import { MdArrowOutward, MdPlayArrow } from "react-icons/md";

interface Props {
  image?: string;
  alt?: string;
  video?: string;
  link?: string;
  aspectRatio?: "horizontal" | "vertical";
}

const WorkImage = (props: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!props.video || !videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const isVertical = props.aspectRatio === "vertical";

  return (
    <div
      className={`work-image ${
        isVertical ? "work-image-vertical" : "work-image-horizontal"
      }`}
    >
      <div className="work-image-in" data-cursor={"disable"}>
        {props.link && (
          <a
            className="work-link"
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdArrowOutward />
          </a>
        )}

        {props.video ? (
          <div className="work-video-wrapper">
            <video
              ref={videoRef}
              src={`${props.video}#t=0.001`}
              poster={props.image}
              preload="metadata"
              playsInline
              controls={isPlaying}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              className="work-video-el"
            />
            {!isPlaying && (
              <button
                type="button"
                className="work-play-btn"
                onClick={handlePlayToggle}
                aria-label="Play project video"
              >
                <div className="work-play-icon">
                  <MdPlayArrow />
                </div>
              </button>
            )}
          </div>
        ) : (
          props.image && (
            <img src={props.image} alt={props.alt || "Project preview"} />
          )
        )}
      </div>
    </div>
  );
};

export default WorkImage;
