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

<ControlPanel />
<div>{message}</div>
<button
  onclick={() => {
    broadcastChannel.postMessage("Hello from Dock!");
    message = "Sent: Hello from Dock!";
  }}
  class="bg-primary text-primary-foreground px-4 py-2 rounded"
>
  Hello from Dock!
</button>
