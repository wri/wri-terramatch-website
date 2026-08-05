const STICKY_COVER_WIDTH = "1rem";

type StickyCoverOptions = {
  leftCover?: boolean;
  rightCover?: boolean;
};

export const buildStickyCoverShadow = (backgroundColor: string, options: StickyCoverOptions = {}): string => {
  const shadows: string[] = [];

  if (options.leftCover) {
    shadows.push(`-${STICKY_COVER_WIDTH} 0 0 0 ${backgroundColor}`);
  }

  if (options.rightCover) {
    shadows.push(`${STICKY_COVER_WIDTH} 0 0 0 ${backgroundColor}`);
  }

  return shadows.join(", ");
};
