<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
  import DropZone from "$lib/components/DropZone.svelte";
  import { messageSchema } from "$lib/schema";
  import type { Control, Image, Message } from "$lib/schema";
  import * as v from "valibot";
  import { imageFileToBlob } from "$lib/utils";
  import ImageMatrix from "$lib/components/ImageLayout/ImageMatrix.svelte";
  import { DBClient } from "$lib/db-client";

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
        // TODO: toast 表示
        console.error("Maximum image count exceeded");
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

  const onDelete = (id: number) => {
    dbClient.deleteImage(id);
    images = images.filter((image) => image.id !== id);
    const message: Message = {
      type: "delete_image",
      id,
    };
    broadcastChannel.postMessage(message);
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
    dbClient.images.then((loadedImages) => {
      images = loadedImages;
    });
    dbClient.control.then((loadedControl) => {
      if (loadedControl) {
        control = loadedControl;
      }
      props.shouldUpdateControl = true;
    });
  });

  $effect(() => {
    broadcastChannel.addEventListener("message", messageHandler);
    return () => {
      broadcastChannel.removeEventListener("message", messageHandler);
    };
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
      // TODO: toast 表示
      console.error("Invalid drop:", message);
    }}
  />
  <ControlPanel bind:control />
  <ImageMatrix mode="dock" {control} {images} {onDelete} />
</div>
