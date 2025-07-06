import type { Control } from "$lib/schema";

type ConstantsType = {
  BROADCAST_CHANNEL_NAME: string;
  MAX_IMAGE_SIZE_PX: number;
  MAX_ASPECT_RATIO: number;
  MAX_IMAGE_SPACING: number;
  MAX_CORNER_RADIUS_PERCENTAGE: number;
  MAX_IMAGE_COUNT: number;
  DEFAULT_CONTROL: Control;
};

export const Constants: ConstantsType = {
  BROADCAST_CHANNEL_NAME: "pictile.tasukaru.app",
  MAX_IMAGE_SIZE_PX: 200,
  MAX_ASPECT_RATIO: 10,
  MAX_IMAGE_SPACING: 2,
  MAX_CORNER_RADIUS_PERCENTAGE: 20,
  MAX_IMAGE_COUNT: 100,
  DEFAULT_CONTROL: {
    id: 0,
    isPlaceholderVisible: true,
    imageSpacing: 1,
    cornerRadiusPercentage: 0,
    cellAspectRatio: { width: 1, height: 1 },
    columnCount: 5,
    rowCount: 4,
  },
};
