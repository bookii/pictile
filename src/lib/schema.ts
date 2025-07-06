import * as v from "valibot";

export const imageSchema = v.object({
  id: v.number(),
  blob: v.blob(),
});

export const controlSchema = v.object({
  id: v.number(),
  isPlaceholderVisible: v.boolean(),
  imageSpacing: v.number(),
  cornerRadiusPercentage: v.number(),
  cellAspectRatio: v.object({
    width: v.number(),
    height: v.number(),
  }),
  columnCount: v.number(),
  rowCount: v.number(),
});

export const messageSchema = v.union([
  v.object({
    type: v.literal("add_image"),
    image: imageSchema,
  }),
  v.object({
    type: v.literal("delete_image"),
    id: v.number(),
  }),
  v.object({
    type: v.literal("control"),
    control: controlSchema,
  }),
  v.object({
    type: v.literal("clear_control"),
  }),
  v.object({
    type: v.literal("clear_images"),
  }),
]);

export type Image = v.InferOutput<typeof imageSchema>;
export type Control = v.InferOutput<typeof controlSchema>;
export type Message = v.InferOutput<typeof messageSchema>;
