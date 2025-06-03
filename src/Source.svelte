<script lang="ts">
  import { Constants } from "$lib/constants";

  let message = $state("");
  const broadcastChannel = new BroadcastChannel(
    Constants.BROADCAST_CHANNEL_NAME
  );
  broadcastChannel.onmessage = (event) => {
    message = event.data;
  };
</script>

<div>Hello world!</div>
<div>{message}</div>
