<script lang="ts">
  import { ImagePlus, LoaderCircle } from "lucide-svelte";
  import Label from "./ui/label/label.svelte";

  type Props = {
    onDropSuccess: (files: File[]) => Promise<void>;
    onDropFailure: (message: string) => void;
  };
  const { onDropSuccess, onDropFailure }: Props = $props();
  let isValidDragEvent = $state(false);
  let isProcessing = $state(false);

  const onDragOver = (event: DragEvent) => {
    if (event.dataTransfer?.types.includes("Files")) {
      event.preventDefault();
      isValidDragEvent = true;
    }
  };

  const onDragLeave = () => {
    isValidDragEvent = false;
  };

  const onDrop = async (event: DragEvent) => {
    isValidDragEvent = false;
    if (event.dataTransfer?.types.includes("Files") !== true) {
      return;
    }
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) {
      console.error("No files found");
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/"))) {
      onDropFailure("無効な形式のファイルが含まれています");
      return;
    }
    if (files.some((file) => file.size > 1024 * 1024)) {
      onDropFailure("ファイルサイズは全て1MB以下にしてください");
      return;
    }
    isProcessing = true;
    await onDropSuccess(files);
    isProcessing = false;
  };
</script>

<div
  role="form"
  class="flex relative items-center w-full h-28 rounded-lg text-center {isValidDragEvent
    ? 'bg-primary'
    : 'bg-secondary'}"
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <div
    class="flex absolute size-full items-center justify-center flex-col space-y-2 mx-auto pb-1"
  >
    <ImagePlus strokeWidth={1.5} class="size-6 text-foreground" />
    <Label class="text-foreground">ここに画像をドロップ</Label>
  </div>
  {#if isProcessing}
    <div
      class="flex absolute size-full items-center justify-center bg-background/50 z-10"
    >
      <LoaderCircle
        strokeWidth={1.5}
        class="size-7 text-foreground animate-spin"
      />
    </div>
  {/if}
</div>
