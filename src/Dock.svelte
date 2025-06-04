<script lang="ts">
  import "./app.css";
  import ControlPanel from "$lib/components/ControlPanel.svelte";
  import { Constants } from "$lib/constants.js";
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
  <ControlPanel />
</div>
