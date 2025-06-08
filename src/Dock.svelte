<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
  import DropZone from "$lib/components/DropZone.svelte";
  import type { Control, Image, Message } from "$lib/schema";
  import { imageFileToBlob } from "$lib/utils";
  import ImageMatrix from "$lib/components/ImageLayout/ImageMatrix.svelte";
  import { DBClient } from "$lib/db-client";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";

  type Props = {
    shouldUpdateControl: boolean;
  };

  const props: Props = {
    shouldUpdateControl: false,
  };

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );
  const dbClient = new DBClient();

  let images: Image[] = $state([]);
  let control: Control = $state(Constants.DEFAULT_CONTROL);

  const onDropSuccess = async (files: File[]) => {
    for (const file of files) {
      if (images.length >= Constants.MAX_IMAGE_COUNT) {
        toast.error(
          `表示できる画像は最大${Constants.MAX_IMAGE_COUNT}件までです`
        );
        return;
      }
      const blob = await imageFileToBlob(file);
      const image = await dbClient.addImage({ blob });
      images = [...images, image];
      const message: Message = {
        type: "add_image",
        image,
      };
      broadcastChannel.postMessage(message);
    }
  };

  const onDeleteImage = (id: number) => {
    dbClient.deleteImage(id);
    images = images.filter((image) => image.id !== id);
    const message: Message = { type: "delete_image", id };
    broadcastChannel.postMessage(message);
  };

  const onClear = async () => {
    await dbClient.clear();
    initializeImages();
    initializeControl();
    toast.success("データを初期化しました");
    const message: Message = {
      type: "clear",
    };
    broadcastChannel.postMessage(message);
  };

  const initializeImages = () => {
    dbClient.images.then((loadedImages) => {
      images = loadedImages;
    });
  };

  const initializeControl = async () => {
    props.shouldUpdateControl = false;
    await new Promise((resolve) => {
      dbClient.control.then((loadedControl) => {
        control = loadedControl;
        resolve({});
      });
    });
    props.shouldUpdateControl = true;
  };

  $effect(() => {
    initializeImages();
    initializeControl();
  });

  $effect(() => {
    broadcastChannel.postMessage({
      type: "control",
      // 複製しないと送信できない
      control: { ...control },
    });
    if (props.shouldUpdateControl) {
      dbClient.updateControl(control);
    }
  });
</script>

<div class="p-2 space-y-2 bg-background min-h-screen">
  <DropZone
    {onDropSuccess}
    onDropFailure={(message) => {
      toast.error(message);
    }}
  />
  <ControlPanel bind:control {onClear} />
  <ImageMatrix mode="dock" {control} {images} onDelete={onDeleteImage} />
  <Toaster />
</div>
