<script lang="ts">
  import Label from "./ui/label/label.svelte";
  import { ImagePlus } from "lucide-svelte";

  type Props = {
    onDropSuccess: (file: File) => void;
    onDropFailure: (message: string) => void;
  };
  const { onDropSuccess, onDropFailure }: Props = $props();
  let isValidDragEvent = $state(false);

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
    const files = event.dataTransfer.files;
    if (files.length === 0) {
      console.error("No files found");
      return;
    }
    if (files.length > 1) {
      onDropFailure("画像は1つずつドロップしてください");
      return;
    }
    const file = files[0];
    onDropSuccess(file);
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
