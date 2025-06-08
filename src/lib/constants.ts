import type { Control } from "$lib/schema";

type ConstantsType = {
  BROADCAST_CHANNEL_NAME: string;
  MAX_IMAGE_SIZE_PX: number;
  MAX_IMAGE_COUNT: number;
  DEFAULT_CONTROL: Control;
};

export const Constants: ConstantsType = {
  BROADCAST_CHANNEL_NAME: "image-grid.tasukaru.app",
  MAX_IMAGE_SIZE_PX: 200,
  MAX_IMAGE_COUNT: 100,
  DEFAULT_CONTROL: {
    id: 0,
    isPlaceholderVisible: true,
    imageSpacingRem: 1,
    columnCount: 5,
    rowCount: 4,
  },
};
