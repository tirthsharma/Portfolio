type StopFn = () => void;

/**
 * Ensures only a single hero video preview plays across the entire marquee at any time.
 * Starting a new preview automatically stops any previously active preview.
 */
class HeroVideoCoordinator {
  private activeId: string | null = null;
  private activeStopFn: StopFn | null = null;

  playActive(id: string, stopFn: StopFn) {
    if (this.activeId && this.activeId !== id && this.activeStopFn) {
      try {
        this.activeStopFn();
      } catch {
        // Silently continue
      }
    }
    this.activeId = id;
    this.activeStopFn = stopFn;
  }

  stopActive(id: string) {
    if (this.activeId === id) {
      this.activeId = null;
      this.activeStopFn = null;
    }
  }
}

export const heroVideoCoordinator = new HeroVideoCoordinator();
