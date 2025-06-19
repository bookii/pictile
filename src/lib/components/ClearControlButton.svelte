<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
  import Button from "$lib/components/ui/button/button.svelte";
  type Props = {
    onClear: () => void;
  };
  const { onClear }: Props = $props();
  let isAlertDialogOpen = $state(false);
</script>

<AlertDialog.Root bind:open={isAlertDialogOpen}>
  <AlertDialog.Trigger>
    <Button variant="outline">
      <span class="text-xs">設定を初期化する</span>
    </Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content class="p-4">
    <AlertDialog.Header>
      <AlertDialog.Title>
        <span class="text-xs">設定を初期化します。よろしいですか？</span>
      </AlertDialog.Title>
      <AlertDialog.Description />
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>
        <span class="text-xs">キャンセル</span>
      </AlertDialog.Cancel>
      <AlertDialog.Action
        onclick={() => {
          onClear();
          isAlertDialogOpen = false;
        }}
      >
        <span class="text-xs">初期化する</span>
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
