<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Slider from "$lib/components/ui/slider/slider.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import type { Control } from "$lib/schema";
  import { Minus, Plus } from "lucide-svelte";
  import ClearButton from "./ClearButton.svelte";

  type Props = {
    control: Control;
    onClear: () => void;
  };
  let { control = $bindable(), onClear }: Props = $props();
</script>

<Accordion.Root type="single" class="border border-border rounded-lg">
  <Accordion.Item value="config-panel">
    <Accordion.Trigger class="px-4 hover:bg-secondary hover:no-underline">
      <span class="text-xs">設定</span>
    </Accordion.Trigger>
    <Accordion.Content class="px-4 pt-4 space-y-4.5">
      <div class="space-y-4">
        <div class="space-y-6">
          <div class="flex justify-between pb-0.5">
            <Label class="text-foreground">プレースホルダーの表示</Label>
            <Switch bind:checked={control.isPlaceholderVisible} />
          </div>
          <div class="space-y-3.5 pb-1">
            <Label class="text-foreground">画像の間隔</Label>
            <Slider
              type="single"
              id="image-spacing-rem"
              min={0}
              max={1.5}
              step={0.25}
              bind:value={control.imageSpacingRem}
            />
          </div>
          <div class="space-y-2.5">
            <Label class="text-foreground">1行あたりの表示数</Label>
            <div class="flex items-center">
              <Button
                variant="secondary"
                class="size-7"
                onclick={() => {
                  control.columnCount--;
                }}
                disabled={control.columnCount <= 1}
              >
                <Minus strokeWidth={2} className="size-4 text-foreground" />
              </Button>
              <div class="text-center w-12 text-foreground">
                {control.columnCount}
              </div>
              <Button
                variant="secondary"
                class="size-7"
                onclick={() => {
                  control.columnCount++;
                }}
                disabled={control.columnCount >= 10}
              >
                <Plus strokeWidth={2} className="size-4 text-foreground" />
              </Button>
            </div>
          </div>
          <div class="space-y-2.5">
            <Label class="text-foreground">行数</Label>
            <div class="flex items-center">
              <Button
                variant="secondary"
                class="size-7"
                onclick={() => {
                  control.rowCount--;
                }}
                disabled={control.rowCount <= 1}
              >
                <Minus strokeWidth={2} className="size-4 text-foreground" />
              </Button>
              <div class="text-center w-12 text-foreground">
                {control.rowCount}
              </div>
              <Button
                variant="secondary"
                class="size-7"
                onclick={() => {
                  control.rowCount++;
                }}
                disabled={control.rowCount >= 10}
              >
                <Plus strokeWidth={2} className="size-4 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div class="flex justify-end">
          <ClearButton {onClear} />
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
