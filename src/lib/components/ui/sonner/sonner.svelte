<script lang="ts">
  import { mode } from "mode-watcher";
  import {
    Toaster as Sonner,
    type ToasterProps as SonnerProps,
  } from "svelte-sonner";

  let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
  theme={mode.current}
  class="toaster group"
  style="--normal-bg: var(--popover); --normal-text: var(--foreground); --normal-border: var(--border); font-family: inherit;"
  {...restProps}
/>

<style>
  :global(.toaster [data-sonner-toast] [data-content]) {
    font-size: 0.75rem !important;
  }
</style>
