import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import MediaPlaceholder from '../components/MediaPlaceholder';
import ProjectVideoFrame from '../components/ProjectVideoFrame';
import { playbackCoordinator } from '../utils/playbackCoordinator';
import { projectsData } from '../data/projects';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
  progress: MotionValue<number>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  progress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // MotionSites reference formula: targetScale = 1 - (totalCards - 1 - index) * 0.03
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / totalCards, 1], [1, targetScale]);

  const hasHeaderContent = Boolean(project.category || project.title);

  // Configurable YouTube video IDs for Box 1, Box 2, and Box 3
  const box1VideoId =
    project.box1VideoId ||
    project.col1Image1?.youtubeId ||
    (project.col1Image1?.type === 'youtube' ? project.col1Image1.url : undefined);

  const box2VideoId =
    project.box2VideoId ||
    project.col1Image2?.youtubeId ||
    (project.col1Image2?.type === 'youtube' ? project.col1Image2.url : undefined);

  const box3VideoId =
    project.box3VideoId ||
    project.col2Image?.youtubeId ||
    (project.col2Image?.type === 'youtube' ? project.col2Image.url : undefined);

  const isCol2Video =
    project.col2Image?.type === 'video' ||
    Boolean(project.col2Image?.url && /\.(mp4|webm|ogg)$/i.test(project.col2Image.url));
  const mainVideoUrl =
    project.videoUrl ||
    (isCol2Video ? project.col2Image?.url : undefined);

  return (
    <div
      ref={containerRef}
      className="sticky top-24 md:top-32 h-[85vh] flex items-center justify-center"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between h-full shadow-2xl overflow-hidden"
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D7E2EA]/20 min-h-[64px]">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-black text-[#D7E2EA] text-[clamp(2.5rem,8vw,100px)] leading-none select-none">
              {project.number}
            </span>
            {hasHeaderContent && (
              <div className="flex flex-col">
                {project.category && (
                  <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D7E2EA]/60">
                    {project.category}
                  </span>
                )}
                {project.title && (
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase text-[#D7E2EA]">
                    {project.title}
                  </h3>
                )}
              </div>
            )}
          </div>

          {/* Render Live Project Button ONLY when liveUrl is non-empty */}
          {project.liveUrl && <LiveProjectButton href={project.liveUrl} />}
        </div>

        {/* Bottom Two-Column Image Grid (40% / 60%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 flex-1 items-stretch">
          {/* Left Column (40% width = 5 cols) - 2 Stacked Media Slots */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {/* Left Top Media - Frame 1 */}
            <div className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden flex-1 min-h-[130px] h-[clamp(130px,16vw,230px)]">
              {box1VideoId ? (
                <ProjectVideoFrame
                  playerId={`${project.id}-frame-1`}
                  videoId={box1VideoId}
                  poster={project.box1Poster}
                  title={project.title ? `${project.title} - Video Frame 1` : `Project ${project.number} - Video Frame 1`}
                  isVertical={false}
                />
              ) : project.col1Image1?.url ? (
                project.col1Image1.type === 'video' || /\.(mp4|webm|ogg)$/i.test(project.col1Image1.url) ? (
                  <div className="project-video-frame-container relative w-full h-full bg-[#141414] border border-[#222222] rounded-[inherit] overflow-hidden flex items-center justify-center">
                    <div className="project-video-frame">
                      <video
                        src={project.col1Image1.url}
                        playsInline
                        autoPlay
                        muted
                        loop
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                        onPlay={() => playbackCoordinator.notifyPlaying(`${project.id}-frame-1-local`)}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={project.col1Image1.url}
                    alt={project.title || `Project ${project.number} View 1`}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <MediaPlaceholder
                  className="w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
                />
              )}
            </div>

            {/* Left Bottom Media - Frame 2 */}
            <div className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden flex-1 min-h-[160px] h-[clamp(160px,22vw,340px)]">
              {box2VideoId ? (
                <ProjectVideoFrame
                  playerId={`${project.id}-frame-2`}
                  videoId={box2VideoId}
                  poster={project.box2Poster}
                  title={project.title ? `${project.title} - Video Frame 2` : `Project ${project.number} - Video Frame 2`}
                  isVertical={false}
                />
              ) : project.col1Image2?.url ? (
                project.col1Image2.type === 'video' || /\.(mp4|webm|ogg)$/i.test(project.col1Image2.url) ? (
                  <div className="project-video-frame-container relative w-full h-full bg-[#141414] border border-[#222222] rounded-[inherit] overflow-hidden flex items-center justify-center">
                    <div className="project-video-frame">
                      <video
                        src={project.col1Image2.url}
                        playsInline
                        autoPlay
                        muted
                        loop
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                        onPlay={() => playbackCoordinator.notifyPlaying(`${project.id}-frame-2-local`)}
                      />
                    </div>
                  </div>
                ) : (
                  <img
                    src={project.col1Image2.url}
                    alt={project.title || `Project ${project.number} View 2`}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <MediaPlaceholder
                  className="w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
                />
              )}
            </div>
          </div>

          {/* Right Column (60% width = 7 cols) - Frame 3: Large Featured Media Slot */}
          <div className="md:col-span-7 w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden min-h-[260px]">
            {box3VideoId ? (
              <ProjectVideoFrame
                playerId={`${project.id}-frame-3`}
                videoId={box3VideoId}
                poster={project.box3Poster}
                title={project.title ? `${project.title} - Video Frame 3` : `Project ${project.number} - Video Frame 3`}
                isVertical={true}
              />
            ) : mainVideoUrl ? (
              <div className="project-video-frame-container relative w-full h-full bg-[#141414] border border-[#222222] rounded-[inherit] overflow-hidden flex items-center justify-center">
                <div className="project-video-frame">
                  <video
                    src={mainVideoUrl}
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-contain"
                    aria-label={project.title || `Project ${project.number} Video Showcase`}
                    onPlay={() => playbackCoordinator.notifyPlaying(`${project.id}-box3-local`)}
                  />
                </div>
              </div>
            ) : project.col2Image?.url ? (
              <img
                src={project.col2Image.url}
                alt={project.title || `Project ${project.number} Main Showcase`}
                className="w-full h-full object-cover"
              />
            ) : (
              <MediaPlaceholder
                className="w-full h-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 pb-32 z-10"
    >
      {/* Section Heading: PROJECTS */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 text-center">
        <h2 className="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)]">
          PROJECTS
        </h2>
      </FadeIn>

      {/* Sticky Stacking Cards Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-12">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            totalCards={projectsData.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
