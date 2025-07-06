<script lang="ts">
  import {
    cn,
    type WithoutChild,
    type WithoutChildrenOrChild,
  } from "$lib/utils.js";
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import AlertDialogOverlay from "./alert-dialog-overlay.svelte";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    ...restProps
  }: WithoutChild<AlertDialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<AlertDialogPrimitive.PortalProps>;
  } = $props();
</script>

<AlertDialogPrimitive.Portal {...portalProps}>
  <AlertDialogOverlay />
  <AlertDialogPrimitive.Content
    bind:ref
    data-slot="alert-dialog-content"
    class={cn(
      "bg-background fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
      className
    )}
    style="transform: translate(-50%, -50%);"
    {...restProps}
  />
</AlertDialogPrimitive.Portal>
