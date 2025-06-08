<script lang="ts">
  import { Constants } from "$lib/constants";
  import type { Control, Image } from "$lib/schema";
  import ImageCell from "$lib/components/ImageLayout/ImageCell.svelte";

  type Mode = "dock" | "source";
  type Props = {
    mode: Mode;
    control: Control;
    images: Image[];
    onDelete?: (id: number) => void;
  };
  const { mode, control, images, onDelete }: Props = $props();

  let itemSize = $state(0);
  let elementRecord: Record<number, HTMLElement | undefined> = $state({});
  let resizeObserver: ResizeObserver | undefined = $state(undefined);
  let animationFrameId: number | undefined = $state(undefined);

  const resizeHandler = (entries: ResizeObserverEntry[]) => {
    if (!elementRecord[0]) {
      return;
    }
    for (const entry of entries) {
      if (entry.target !== elementRecord[0]) {
        return;
      }
      animationFrameId = requestAnimationFrame(() => {
        itemSize = entry.contentBoxSize[0].blockSize;
      });
    }
  };

  const gridColumnClass = (columnCount: number) => {
    const validColumnCount = Math.max(1, Math.min(columnCount, 10));
    // `grid-cols-${validColumnCount}` は動作しない
    switch (validColumnCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      case 6:
        return "grid-cols-6";
      case 7:
        return "grid-cols-7";
      case 8:
        return "grid-cols-8";
      case 9:
        return "grid-cols-9";
      case 10:
        return "grid-cols-10";
    }
  };

  const placeholderBgClass = (columnCount: number, index: number) => {
    const rowIndex = Math.floor(index / columnCount);
    const columnIndex = index % columnCount;
    return rowIndex % 2 === columnIndex % 2
      ? "bg-gray-600/50"
      : "bg-gray-400/50";
  };

  $effect(() => {
    if (elementRecord[0]) {
      const observer = new ResizeObserver(resizeHandler);
      observer.observe(elementRecord[0]);
      resizeObserver = observer;
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = undefined;
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    };
  });
</script>

<div
  class="grid {gridColumnClass(control.columnCount)}"
  style="gap: {control.imageSpacingRem *
    (itemSize / Constants.MAX_IMAGE_SIZE_PX)}rem;"
>
  {#each { length: control.columnCount * control.rowCount }, index}
    <div
      bind:this={elementRecord[index]}
      class="aspect-square max-size-full
      {control.isPlaceholderVisible
        ? placeholderBgClass(control.columnCount, index)
        : ''}"
    >
      {#if index < images.length}
        <ImageCell image={images[index]} {mode} {onDelete} />
      {:else}
        <!-- placeholder -->
        <svg width="100%" height="100%" />
      {/if}
    </div>
  {/each}
</div>
