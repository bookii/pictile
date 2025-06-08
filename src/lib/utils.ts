import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import reduce from "image-blob-reduce";
import { Constants } from "$lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, "children">
  : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null;
};

export const imageFileToBlob = async (file: File): Promise<Blob> => {
  return reduce().toBlob(file, { max: Constants.MAX_IMAGE_SIZE_PX });
};
