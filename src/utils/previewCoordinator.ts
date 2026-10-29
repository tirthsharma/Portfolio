type StopCallback = () => void;

/**
 * Ensures only a single video hover preview is active at any time.
 */
class PreviewCoordinator {
  private activeId: string | null = null;
  private activeStop: StopCallback | null = null;

  setActive(id: string, stopFn: StopCallback) {
    if (this.activeId && this.activeId !== id && this.activeStop) {
      try {
        this.activeStop();
      } catch {
        // Silently continue
      }
    }
    this.activeId = id;
    this.activeStop = stopFn;
  }

  clear(id: string) {
    if (this.activeId === id) {
      this.activeId = null;
      this.activeStop = null;
    }
  }
}

export const previewCoordinator = new PreviewCoordinator();
