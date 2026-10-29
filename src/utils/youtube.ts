/**
 * Converts a YouTube video ID, watch URL, embed URL, or short URL into
 * YouTube's official embed URL format: https://www.youtube.com/embed/VIDEO_ID
 *
 * Includes enablejsapi=1 by default so playback events and coordination
 * (auto-pausing other videos) can be controlled via postMessage.
 */
export function getYouTubeEmbedUrl(
  input?: string,
  options?: { enableJsApi?: boolean }
): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  let videoId = trimmed;

  // Handle existing embed URLs (e.g. https://www.youtube.com/embed/VIDEO_ID)
  if (trimmed.includes('youtube.com/embed/')) {
    const match = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  } else if (trimmed.includes('youtu.be/')) {
    // Handle youtu.be/VIDEO_ID
    const match = trimmed.match(/youtu\.be\/([^?&/]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  } else if (trimmed.includes('watch')) {
    // Handle youtube.com/watch?v=VIDEO_ID
    const match = trimmed.match(/[?&]v=([^&]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  } else if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const v = url.searchParams.get('v');
      if (v) {
        videoId = v;
      } else {
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          videoId = segments[segments.length - 1];
        }
      }
    } catch {
      // Fallback to raw trimmed string
    }
  }

  const enableJsApi = options?.enableJsApi ?? true;
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  return enableJsApi ? `${baseUrl}?enablejsapi=1` : baseUrl;
}
