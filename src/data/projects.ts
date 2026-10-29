import type { Project } from '../types';
import meetMarvinVideo from '../../tirth/Horizonatal/Meet Marvin portfolio 1.mp4';
import googleWorkspaceVideo from '../../tirth/Horizonatal/Google Workspace Portfolio.mp4';
import bychanceVideo from '../../tirth/Horizonatal/Bychance Portfolio 3.mp4';

/**
 * Centralized configuration array for the 9 YouTube videos in the Projects section.
 * Exactly 9 video IDs mapped sequentially to the 3 main containers (3 frames each).
 */
export const YOUTUBE_VIDEO_IDS = [
  'YbBtLN33IKQ', // Index 0: Main Container 01 - Frame 1 (Top-Left)
  'JVtYOMj8pUM', // Index 1: Main Container 01 - Frame 2 (Bottom-Left)
  'tvMw6YbsDaU', // Index 2: Main Container 01 - Frame 3 (Large Right)
  'x7q1A-jnwqw', // Index 3: Main Container 02 - Frame 1 (Top-Left)
  '20BWnAM6-98', // Index 4: Main Container 02 - Frame 2 (Bottom-Left)
  'dE5y08xUrg0', // Index 5: Main Container 02 - Frame 3 (Large Right)
  'yMkiNBHoV8g', // Index 6: Main Container 03 - Frame 1 (Top-Left)
  'AMIfgasY4V8', // Index 7: Main Container 03 - Frame 2 (Bottom-Left)
  '01fXTgHc_bw', // Index 8: Main Container 03 - Frame 3 (Large Right)
] as const;

export interface ProjectSectionYouTubeConfig {
  box1VideoId: string; // Frame 1: Top-left container
  box2VideoId: string; // Frame 2: Bottom-left container
  box3VideoId: string; // Frame 3: Large right-side container
}

export interface ProjectsYouTubeConfig {
  section01: ProjectSectionYouTubeConfig;
  section02: ProjectSectionYouTubeConfig;
  section03: ProjectSectionYouTubeConfig;
}

/**
 * Structured mapping derived from the centralized YOUTUBE_VIDEO_IDS array.
 */
export const projectsYouTubeConfig: ProjectsYouTubeConfig = {
  section01: {
    box1VideoId: YOUTUBE_VIDEO_IDS[0],
    box2VideoId: YOUTUBE_VIDEO_IDS[1],
    box3VideoId: YOUTUBE_VIDEO_IDS[2],
  },
  section02: {
    box1VideoId: YOUTUBE_VIDEO_IDS[3],
    box2VideoId: YOUTUBE_VIDEO_IDS[4],
    box3VideoId: YOUTUBE_VIDEO_IDS[5],
  },
  section03: {
    box1VideoId: YOUTUBE_VIDEO_IDS[6],
    box2VideoId: YOUTUBE_VIDEO_IDS[7],
    box3VideoId: YOUTUBE_VIDEO_IDS[8],
  },
};

// Backwards-compatible aliases
export const projectYouTubeConfig = projectsYouTubeConfig.section01;
export type ProjectYouTubeConfig = ProjectSectionYouTubeConfig;

// Exactly 3 main project containers matching MotionSites architecture.
// Each container holds 3 individual 16:9 YouTube video frames.
export const projectsData: Project[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'MOTION DESIGN',
    category: '',
    description: '',
    box1VideoId: projectsYouTubeConfig.section01.box1VideoId,
    box2VideoId: projectsYouTubeConfig.section01.box2VideoId,
    box3VideoId: projectsYouTubeConfig.section01.box3VideoId,
    box1Poster: '',
    box2Poster: '',
    box3Poster: '',
    videoUrl: meetMarvinVideo,
    col2Image: {
      type: 'video',
      url: meetMarvinVideo,
      aspectRatio: '16/9',
      alt: 'Project 01 Video Showcase',
    },
    liveUrl: '',
  },
  {
    id: 'project-02',
    number: '02',
    title: 'SAAS VIDEOS',
    category: '',
    description: '',
    box1VideoId: projectsYouTubeConfig.section02.box1VideoId,
    box2VideoId: projectsYouTubeConfig.section02.box2VideoId,
    box3VideoId: projectsYouTubeConfig.section02.box3VideoId,
    box1Poster: '',
    box2Poster: '',
    box3Poster: '',
    videoUrl: googleWorkspaceVideo,
    col2Image: {
      type: 'video',
      url: googleWorkspaceVideo,
      aspectRatio: '16/9',
      alt: 'Project 02 Video Showcase',
    },
    liveUrl: '',
  },
  {
    id: 'project-03',
    number: '03',
    title: 'DOCUMENTARY VIDEOS',
    category: '',
    description: '',
    box1VideoId: projectsYouTubeConfig.section03.box1VideoId,
    box2VideoId: projectsYouTubeConfig.section03.box2VideoId,
    box3VideoId: projectsYouTubeConfig.section03.box3VideoId,
    box1Poster: '',
    box2Poster: '',
    box3Poster: '',
    videoUrl: bychanceVideo,
    col2Image: {
      type: 'video',
      url: bychanceVideo,
      aspectRatio: '16/9',
      alt: 'Project 03 Video Showcase',
    },
    liveUrl: '',
  },
];
