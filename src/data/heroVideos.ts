export interface HeroVideoConfig {
  id: number;
  originalFile: string;
  videoUrl: string;
  posterUrl: string;
  startTime: number;
  duration: number;
  youtube?: string; // Optional YouTube video ID or URL. If set, clicking opens the lightbox.
}

/**
 * Configuration for the 12 hero marquee video previews generated from 'Upar wale videos'.
 * Start times and durations can be adjusted here at any time.
 */
export const heroVideosConfig: HeroVideoConfig[] = [
  {
    id: 1,
    originalFile: '10File .mp4',
    videoUrl: '/hero/1.mp4',
    posterUrl: '/hero/1.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 2,
    originalFile: '11File .mp4',
    videoUrl: '/hero/2.mp4',
    posterUrl: '/hero/2.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 3,
    originalFile: '12File .mp4',
    videoUrl: '/hero/3.mp4',
    posterUrl: '/hero/3.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 4,
    originalFile: '13File .mp4',
    videoUrl: '/hero/4.mp4',
    posterUrl: '/hero/4.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 5,
    originalFile: '14File .mp4',
    videoUrl: '/hero/5.mp4',
    posterUrl: '/hero/5.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 6,
    originalFile: '15File .mp4',
    videoUrl: '/hero/6.mp4',
    posterUrl: '/hero/6.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 7,
    originalFile: '16File .mp4',
    videoUrl: '/hero/7.mp4',
    posterUrl: '/hero/7.webp',
    startTime: 0.0,
    duration: 5.44,
    youtube: '',
  },
  {
    id: 8,
    originalFile: '17File .mp4',
    videoUrl: '/hero/8.mp4',
    posterUrl: '/hero/8.webp',
    startTime: 0.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 9,
    originalFile: '18File .mp4',
    videoUrl: '/hero/9.mp4',
    posterUrl: '/hero/9.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 10,
    originalFile: '1File .mp4',
    videoUrl: '/hero/10.mp4',
    posterUrl: '/hero/10.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 11,
    originalFile: '2File .mp4',
    videoUrl: '/hero/11.mp4',
    posterUrl: '/hero/11.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
  {
    id: 12,
    originalFile: '3File .mp4',
    videoUrl: '/hero/12.mp4',
    posterUrl: '/hero/12.webp',
    startTime: 2.0,
    duration: 6.0,
    youtube: '',
  },
];

// Row 1 uses items 1-6
export const row1HeroVideos: HeroVideoConfig[] = heroVideosConfig.slice(0, 6);

// Row 2 uses items 7-12
export const row2HeroVideos: HeroVideoConfig[] = heroVideosConfig.slice(6, 12);
