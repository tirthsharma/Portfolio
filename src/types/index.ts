export interface Profile {
  name: string;
  role: string;
  focusAreas: string[];
  bio: string;
  tagline: string;
  taglines?: string[];
  positioning: string;
  contactEmail?: string;
  whatsappUrl?: string;
  resumeUrl?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
}

export interface MediaItem {
  type: 'image' | 'gif' | 'video' | 'youtube' | 'placeholder';
  url?: string;
  alt?: string;
  aspectRatio?: string;
  youtubeId?: string;
}

export interface Project {
  id: string;
  number: string; // e.g. "01"
  title: string;
  category: string;
  description?: string;
  col1Image1?: MediaItem;
  col1Image2?: MediaItem;
  col2Image?: MediaItem;
  videoUrl?: string;
  liveUrl?: string;
  // Configurable YouTube video IDs for the 3 media containers
  box1VideoId?: string; // Box 1: Top-left container
  box2VideoId?: string; // Box 2: Bottom-left container
  box3VideoId?: string; // Box 3: Large right-side container
  box1Poster?: string;
  box2Poster?: string;
  box3Poster?: string;
}

export interface Service {
  id: string;
  number: string; // e.g. "01"
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  number: string; // e.g. "01"
  company: string;
  period: string;
  role: string;
  detail?: string;
  description: string;
  capabilities?: string[];
  stats?: {
    value: string;
    label: string;
  }[];
}

export interface MarqueeTile {
  id: string;
  media?: MediaItem;
  title?: string;
  projectUrl?: string;
}

export interface AboutAsset {
  id: string;
  url: string;
  alt: string;
  positionClass: string;
  widthClass: string;
  delay: number;
  initialX: number;
  initialY: number;
  magnetConfig?: {
    padding?: number;
    strength?: number;
    maxDistance?: number;
    damping?: number;
    rotateStrength?: number;
    floatClassName?: string;
  };
}

export interface ToolItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  type: 'badge' | 'svg';
  svgPath?: string;
  svgViewBox?: string;
}

