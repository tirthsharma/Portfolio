import type { MarqueeTile } from '../types';

// Data-driven marquee tile definitions.
// Exactly 11 tiles in Row 1 and 10 tiles in Row 2 matching MotionSites concept.
// Media slots are editable and initially empty to avoid fake portfolio work.
export const row1Tiles: MarqueeTile[] = Array.from({ length: 11 }, (_, i) => ({
  id: `row1-tile-${i + 1}`,
}));

export const row2Tiles: MarqueeTile[] = Array.from({ length: 10 }, (_, i) => ({
  id: `row2-tile-${i + 1}`,
}));
