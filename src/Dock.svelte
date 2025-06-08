<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
  import DropZone from "$lib/components/DropZone.svelte";
  import { messageSchema } from "$lib/schema";
  import type { Control, Image, Message } from "$lib/schema";
  import { ulid } from "ulid";
  import * as v from "valibot";
  import { imageFileToBlob } from "$lib/utils";
  import ImageMatrix from "$lib/components/ImageLayout/ImageMatrix.svelte";
  import { loadControl, loadImages, saveControl, saveImages } from "$lib/store";

  type Props = {
    controlSnapshot: string;
  };

  const props: Props = {
    controlSnapshot: JSON.stringify(Constants.DEFAULT_CONTROL),
  };

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );

  let images: Image[] = $state([]);
  let control: Control = $state(Constants.DEFAULT_CONTROL);

  const onDropSuccess = async (file: File) => {
    if (images.length >= Constants.MAX_IMAGE_COUNT) {
      // TODO: toast 表示
      console.error("Maximum image count exceeded");
      return;
    }
    const id = ulid();
    const blob = await imageFileToBlob(file);
    const image: Image = {
      id,
      blob,
    };
    images = [...images, image];
    const message: Message = {
      type: "add_image",
      image,
    };
    broadcastChannel.postMessage(message);
    saveImages(images);
  };

  const onDelete = (id: string) => {
    images = images.filter((image) => image.id !== id);
    const message: Message = {
      type: "delete_image",
      id,
    };
    broadcastChannel.postMessage(message);
    saveImages(images);
  };

  const messageHandler = async (event: MessageEvent) => {
    const parseResult = v.safeParse(messageSchema, event.data);
    if (!parseResult.success) {
      console.error("Invalid message format:", event.data);
      return;
    }
    const message = parseResult.output;
    switch (message.type) {
      case "initialize_source_request":
        const controlMessage: Message = {
          type: "control",
          control: { ...control },
        };
        broadcastChannel.postMessage(controlMessage);
        for (const image of images) {
          const addImageMessage: Message = {
            type: "add_image",
            image: {
              id: image.id,
              blob: new Blob([image.blob], {
                type: image.blob.type,
              }),
            },
          };
          console.log("Sending image to source:", addImageMessage);
          broadcastChannel.postMessage(addImageMessage);
          // 負荷分散のために sleep を入れる
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        break;
      default:
        console.error(`message "${message.type}" must not be received in Dock`);
        break;
    }
  };

  $effect(() => {
    loadImages().then((loadedImages) => {
      images = loadedImages;
    });
  });

  $effect(() => {
    loadControl().then((loadedControl) => {
      if (loadedControl) {
        control = loadedControl;
      }
    });
  });

  $effect(() => {
    saveControl(control);
  });

  $effect(() => {
    broadcastChannel.addEventListener("message", messageHandler);

    const updatedControlSnapshot = JSON.stringify(control);
    if (props.controlSnapshot !== updatedControlSnapshot) {
      broadcastChannel.postMessage({
        type: "control",
        // 複製しないと送信できない
        control: { ...control },
      });
      props.controlSnapshot = updatedControlSnapshot;
    }

    return () => {
      broadcastChannel.removeEventListener("message", messageHandler);
    };
  });
</script>

<div class="p-2 space-y-2 bg-background min-h-screen">
  <DropZone
    {onDropSuccess}
    onDropFailure={(message) => {
      // TODO: toast 表示
      console.error("Invalid drop:", message);
    }}
  />
  <ControlPanel bind:control />
  <ImageMatrix mode="dock" {control} {images} {onDelete} />
</div>
