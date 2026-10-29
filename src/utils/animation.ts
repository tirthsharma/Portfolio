export const EASE_CUSTOM = [0.25, 0.1, 0.25, 1.0] as const;

export const fadeInVariants = {
  hidden: (custom: { x?: number; y?: number } = {}) => ({
    opacity: 0,
    x: custom.x ?? 0,
    y: custom.y ?? 30,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_CUSTOM,
    },
  },
};
