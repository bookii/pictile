<script lang="ts">
  import { Constants } from "$lib/constants";
  import { messageSchema } from "$lib/schema";
  import type { Control, Image, Message } from "$lib/schema";
  import ImageMatrix from "$lib/components/ImageLayout/ImageMatrix.svelte";
  import * as v from "valibot";
  import { DBClient } from "$lib/db-client";

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );
  const dbClient = new DBClient();

  let images: Image[] = $state([]);
  let control: Control = $state(Constants.DEFAULT_CONTROL);

  const messageHandler = async (event: MessageEvent) => {
    const parseResult = v.safeParse(messageSchema, event.data);
    if (!parseResult.success) {
      console.error("Invalid message format:", event.data);
      return;
    }
    const message = parseResult.output;
    switch (message.type) {
      case "control":
        control = message.control;
        break;
      case "add_image":
        images = [...images, message.image];
        break;
      case "delete_image":
        images = images.filter((image) => image.id !== message.id);
        break;
    }
  };

  $effect(() => {
    broadcastChannel.addEventListener("message", messageHandler);
    return () => {
      broadcastChannel.removeEventListener("message", messageHandler);
    };
  });

  $effect(() => {
    dbClient.images.then((fetchedImages) => {
      images = fetchedImages;
    });
    dbClient.control.then((fetchedControl) => {
      if (fetchedControl) {
        control = fetchedControl;
      }
    });
  });
</script>

<ImageMatrix mode="source" {control} {images} />
