<script lang="ts">
  import { Constants } from "$lib/constants";
  import { messageSchema } from "$lib/schema";
  import type { Control, Image, Message } from "$lib/schema";
  import * as v from "valibot";

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );

  let imageRecord: Record<string, Image> = $state({});
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
      case "image":
        imageRecord[message.image.id] = message.image;
        break;
      case "initialize_source_request":
        console.error("initialize_source_request must not be received in Dock");
        break;
      case "initialize_source_response":
        for (const image of message.images) {
          imageRecord[image.id] = image;
        }
        control = message.control;
        break;
    }
  };

  $effect(() => {
    broadcastChannel.addEventListener("message", messageHandler);
    let message: Message = {
      type: "initialize_source_request",
    };
    broadcastChannel.postMessage(message);
    return () => {
      broadcastChannel.removeEventListener("message", messageHandler);
    };
  });
</script>
