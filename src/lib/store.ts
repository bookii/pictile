import { savedImageSchema } from "$lib/schema";
import type { Image, SavedImage } from "$lib/schema";
import * as v from "valibot";

const IMAGES_KEY = "images";
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
  console.log("Loaded saved images:", savedImages);
  return images;
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
  console.log(JSON.stringify(savedImages));
  sessionStorage.setItem(IMAGES_KEY, JSON.stringify(savedImages));
};
