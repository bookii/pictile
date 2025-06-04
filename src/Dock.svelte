<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
  import DropZone from "$lib/components/DropZone.svelte";
  let message = $state("");

  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );

  $effect(() => {
    broadcastChannel.postMessage("Hello");
    message = "Hello";
  });
</script>

<div class="p-2 space-y-2 bg-background min-h-screen">
  <DropZone
    onDropFile={(file) => {
      console.log("File dropped:", file);
    }}
    onDropUrl={(url) => {
      console.log("URL dropped:", url);
    }}
    onInvalidDrop={(message) => {
      console.error("Invalid drop:", message);
    }}
  />
  <ControlPanel />
</div>
