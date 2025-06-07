import * as v from "valibot";

export const imageSchema = v.object({
  id: v.pipe(v.string(), v.ulid()),
  blob: v.blob(),
});

export const controlSchema = v.object({
  isPlaceholderVisible: v.boolean(),
  imageSpacingRem: v.number(),
  columnCount: v.number(),
  rowCount: v.number(),
});

export const messageSchema = v.union([
  v.object({
    type: v.literal("image"),
    image: imageSchema,
  }),
  v.object({
    type: v.literal("control"),
    control: controlSchema,
  }),
]);

export type Image = v.InferOutput<typeof imageSchema>;
export type Control = v.InferOutput<typeof controlSchema>;
