<script lang="ts">
  import Label from "./ui/label/label.svelte";
  import { ImagePlus } from "lucide-svelte";

  type Props = {
    onDropFile: (file: File) => void;
    onDropUrl: (url: string) => void;
    onInvalidDrop: (message: string) => void;
  };
  const { onDropFile, onDropUrl, onInvalidDrop }: Props = $props();
  let isValidDragEvent = $state(false);

  const onDragOver = (event: DragEvent) => {
    if (
      event.dataTransfer?.types.includes("text/uri-list") ||
      event.dataTransfer?.types.includes("Files")
    ) {
      event.preventDefault();
      isValidDragEvent = true;
    }
  };

  const onDragLeave = (event: DragEvent) => {
    isValidDragEvent = false;
  };

  const onDrop = async (event: DragEvent) => {
    isValidDragEvent = false;
    if (event.dataTransfer?.types.includes("Files")) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length === 0) {
        console.error("No files found");
        return;
      }
      if (files.length > 1) {
        onInvalidDrop("画像は1つずつドロップしてください");
        return;
      }
      const file = files[0];
      // TODO: バリデーション
      onDropFile(file);
    } else if (event.dataTransfer?.types.includes("text/uri-list")) {
      event.preventDefault();
      const url = event.dataTransfer.getData("text/uri-list");
      if (false) {
        // TODO: バリデーション
        onInvalidDrop("無効なURLです");
        return;
      }
      onDropUrl(url);
    }
  };
</script>

<div
  role="form"
  class="flex items-center w-full h-28 rounded-lg text-center {isValidDragEvent
    ? 'bg-primary'
    : 'bg-secondary'}"
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <div
    class="flex size-full items-center justify-center flex-col space-y-2 mx-auto pb-1"
  >
    <ImagePlus strokeWidth={1.5} class="size-6 text-foreground" />
    <Label class="text-foreground">ここに画像をドロップ</Label>
  </div>
</div>
