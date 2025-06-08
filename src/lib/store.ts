import { savedImageSchema, controlSchema } from "$lib/schema";
import type { Image, Control, SavedImage } from "$lib/schema";
import * as v from "valibot";

const IMAGES_KEY = "images.image-grid.tasukaru.app";
const CONTROL_KEY = "control.image-grid.tasukaru.app";

export const loadImages = async (): Promise<Image[]> => {
  const imagesJsonString = sessionStorage.getItem(IMAGES_KEY);
  if (!imagesJsonString) {
    return [];
  }
  const parseResult = v.safeParse(
    v.array(savedImageSchema),
    JSON.parse(imagesJsonString)
  );
  if (!parseResult.success) {
    console.error("Failed to parse saved images:", parseResult.issues);
    return [];
  }
  const savedImages = parseResult.output;
  const images: Image[] = await Promise.all(
    savedImages.map(async (savedImage) => {
      const binaryString = atob(savedImage.arrayBufferString);
      const bytes = new Uint8Array(binaryString.length).map((_, i) => {
        return binaryString.charCodeAt(i);
      });
      return {
        id: savedImage.id,
        blob: new Blob([bytes], { type: savedImage.type }),
      };
    })
  );
  return images;
};

export const loadControl = async (): Promise<Control | undefined> => {
  const controlJsonString = sessionStorage.getItem(CONTROL_KEY);
  if (!controlJsonString) {
    return undefined;
  }
  const parseResult = v.safeParse(controlSchema, JSON.parse(controlJsonString));
  if (!parseResult.success) {
    console.error("Failed to parse control:", parseResult.issues);
    return undefined;
  }
  return parseResult.output;
};

export const saveImages = async (images: Image[]): Promise<void> => {
  const savedImages: SavedImage[] = await Promise.all(
    images.map(async (image) => {
      const arrayBuffer = await image.blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const binaryString = String.fromCharCode(...bytes);
      return {
        id: image.id,
        arrayBufferString: btoa(binaryString),
        type: image.blob.type,
      };
    })
  );
  sessionStorage.setItem(IMAGES_KEY, JSON.stringify(savedImages));
};

export const saveControl = async (control: Control): Promise<void> => {
  const controlJsonString = JSON.stringify(control);
  sessionStorage.setItem(CONTROL_KEY, controlJsonString);
};
