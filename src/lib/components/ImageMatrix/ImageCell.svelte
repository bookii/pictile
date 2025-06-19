<script lang="ts">
  import type { Image } from "$lib/schema";
  import DeleteImageButton from "./DeleteImageButton.svelte";

  type Mode = "dock" | "source";

  type Props = {
    image: Image;
    cellAspectRatio: { width: number; height: number };
    mode: Mode;
    onDelete?: (id: number) => void;
  };
  const { image, cellAspectRatio, mode, onDelete }: Props = $props();

  let imageUrl: string | undefined = $state(undefined);

  $effect(() => {
    imageUrl = URL.createObjectURL(image.blob);
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  });
</script>

<div class="relative aspect-square size-full">
  <img
    src={imageUrl}
    alt=""
    class="absolute inset-0 object-contain size-full"
    style="aspect-ratio: {cellAspectRatio.width / cellAspectRatio.height};"
  />
  {#if mode === "dock"}
    <div
      class="absolute inset-0.5 z-10 opacity-0 hover:opacity-100 transition-opacity"
    >
      <DeleteImageButton {image} {onDelete} />
    </div>
  {/if}
</div>
