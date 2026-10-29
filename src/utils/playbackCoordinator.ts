/**
 * Centralized Playback Coordinator for YouTube and fallback video players.
 *
 * Requirements:
 * - Coordinates playback across all 9 video frames in the Projects section.
 * - When any player begins playing, all other initialized players pause immediately.
 * - Paused players are NEVER automatically resumed.
 * - Dynamically registers and unregisters lazily-loaded players without race conditions.
 * - Injects the YouTube IFrame API script at most once.
 */

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLIFrameElement | string,
        options: Record<string, unknown>
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  pauseVideo: () => void;
  playVideo: () => void;
  getPlayerState?: () => number;
  destroy?: () => void;
}

type PauseCallback = () => void;

export interface RegisteredPlayer {
  id: string;
  iframeWindow?: Window | null;
  ytPlayer?: YTPlayer | null;
  videoElement?: HTMLVideoElement | null;
  pause: PauseCallback;
}

class PlaybackCoordinator {
  private players: Map<string, RegisteredPlayer> = new Map();
  private isListening = false;
  private apiLoadPromise: Promise<void> | null = null;

  constructor() {
    this.initGlobalListener();
  }

  /**
   * Injects the YouTube IFrame Player API script at most once.
   */
  loadYouTubeApi(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.YT && window.YT.Player) {
      return Promise.resolve();
    }
    if (this.apiLoadPromise) {
      return this.apiLoadPromise;
    }

    this.apiLoadPromise = new Promise((resolve) => {
      // Check if script tag already exists in document
      const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existing) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        resolve();
      };

      // Fallback verification timer
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });

    return this.apiLoadPromise;
  }

  private initGlobalListener() {
    if (typeof window === 'undefined' || this.isListening) return;
    this.isListening = true;

    window.addEventListener('message', (event) => {
      if (!event.data) return;

      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }

        // Detect YouTube PLAYING state:
        // 1 = YT.PlayerState.PLAYING
        const playingState = window.YT?.PlayerState?.PLAYING ?? 1;
        const isPlaying =
          (data.event === 'onStateChange' && data.info === playingState) ||
          (data.event === 'infoDelivery' && data.info && data.info.playerState === playingState);

        if (isPlaying && event.source) {
          for (const [id, player] of this.players.entries()) {
            if (player.iframeWindow === event.source) {
              this.notifyPlaying(id);
              break;
            }
          }
        }
      } catch {
        // Silently ignore cross-origin or irrelevant messages
      }
    });
  }

  registerPlayer(player: RegisteredPlayer): () => void {
    this.players.set(player.id, player);
    return () => {
      this.players.delete(player.id);
    };
  }

  notifyPlaying(activePlayerId: string) {
    for (const [id, player] of this.players.entries()) {
      if (id !== activePlayerId) {
        try {
          player.pause();
        } catch (err) {
          console.warn(`[PlaybackCoordinator] Failed to pause player ${id}`, err);
        }
      }
    }
  }
}

export const playbackCoordinator = new PlaybackCoordinator();
