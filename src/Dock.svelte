<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
  import DropZone from "$lib/components/DropZone.svelte";
  import { messageSchema } from "$lib/schema";
  import type { Control, Image, Message } from "$lib/schema";
  import { ulid } from "ulid";
  import * as v from "valibot";
  import { convertImageFileToBlob } from "$lib/utils";

  type Props = {
    controlSnapshot: string;
  };

  const props: Props = {
    controlSnapshot: JSON.stringify(Constants.DEFAULT_CONTROL),
  };

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );

  let imageRecord: Record<string, Image> = $state({});
  let control: Control = $state(Constants.DEFAULT_CONTROL);
  let blobUrlString: string | undefined = $state(undefined);

  const onDropSuccess = async (file: File) => {
    if (Object.keys(imageRecord).length >= Constants.MAX_IMAGE_COUNT) {
      // TODO: toast 表示
      console.error("Maximum image count exceeded");
      return;
    }
    const id = ulid();
    const blob = await convertImageFileToBlob(file);
    const image: Image = {
      id,
      blob,
    };
    imageRecord[id] = image;
    broadcastChannel.postMessage({
      type: "image",
      image,
    });
    blobUrlString = URL.createObjectURL(blob);
  };

  const messageHandler = async (event: MessageEvent) => {
    const parseResult = v.safeParse(messageSchema, event.data);
    if (!parseResult.success) {
      console.error("Invalid message format:", event.data);
      return;
    }
    const message = parseResult.output;
    switch (message.type) {
      case "control":
        console.error("message 'control' must not be received in Dock");
        break;
      case "image":
        console.error("message 'image' must not be received in Dock");
        break;
      case "initialize_source_request":
        const responseMessage: Message = {
          type: "initialize_source_response",
          images: Object.values({ ...imageRecord }),
          control: { ...control },
        };
        broadcastChannel.postMessage(responseMessage);
        break;
      case "initialize_source_response":
        console.error(
          "message 'initialize_source_response' must not be received in Dock"
        );
        break;
    }
  };

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
  {#if blobUrlString}
    <img src={blobUrlString} alt="test" />
  {/if}
</div>
