<script lang="ts">
  import type { Image } from "$lib/schema";
  import DeleteImageButton from "./DeleteImageButton.svelte";

  type Mode = "dock" | "source";

  type Props = {
    image: Image;
    mode: Mode;
    onDelete?: (id: string) => void;
  };
  const { image, mode, onDelete }: Props = $props();

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
    class="absolute inset-0 aspect-square object-cover size-full"
  />
  {#if mode === "dock"}
    <div
      class="absolute inset-0.5 z-10 opacity-0 hover:opacity-100 transition-opacity"
    >
      <DeleteImageButton {image} {onDelete} />
    </div>
  {/if}
</div>
