<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import type { Image } from "$lib/schema";
  import { X } from "lucide-svelte";

  type Props = {
    image: Image;
    onDelete?: (id: number) => void;
  };
  const { image, onDelete }: Props = $props();
  let imageUrl: string | undefined = $state(undefined);
  let isAlertDialogOpen = $state(false);

  const onClickDeleteButton = () => {
    if (onDelete) {
      onDelete(image.id);
    }
    isAlertDialogOpen = false;
  };

  $effect(() => {
    imageUrl = URL.createObjectURL(image.blob);
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  });
</script>

<AlertDialog.Root bind:open={isAlertDialogOpen}>
  <AlertDialog.Trigger>
    <Button variant="secondary" size="icon" class="size-5 opacity-80">
      <X class="size-4 text-white" />
    </Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content class="p-4">
    <AlertDialog.Header>
      <AlertDialog.Title>
        <span class="text-xs">本当にこの画像を削除しますか？</span>
      </AlertDialog.Title>
      <AlertDialog.Description>
        <span class="flex justify-center sm:justify-normal">
          <img src={imageUrl} alt="" class="size-16 justify-center" />
        </span>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>
        <span class="text-xs">キャンセル</span>
      </AlertDialog.Cancel>
      <AlertDialog.Destructive onclick={() => onClickDeleteButton()}>
        <span class="text-xs">削除する </span>
      </AlertDialog.Destructive>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
