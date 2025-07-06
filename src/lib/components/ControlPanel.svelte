<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Slider from "$lib/components/ui/slider/slider.svelte";
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { Constants } from "$lib/constants";
  import type { Control } from "$lib/schema";
  import { Minus, Plus } from "lucide-svelte";
  import ClearControlButton from "./ClearControlButton.svelte";
  import ClearImagesButton from "./ClearImagesButton.svelte";

  type Props = {
    control: Control;
    onClearControl: () => void;
    onClearImages: () => void;
  };
  let {
    control = $bindable(),
    onClearControl,
    onClearImages,
  }: Props = $props();
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
              id="image-spacing"
              min={0}
              max={Constants.MAX_IMAGE_SPACING}
              step={0.25}
              bind:value={control.imageSpacing}
            />
          </div>
          <div class="space-y-3.5 pb-1">
            <Label class="text-foreground">角丸の大きさ</Label>
            <Slider
              type="single"
              id="corner-radius"
              min={0}
              max={Constants.MAX_CORNER_RADIUS_PERCENTAGE}
              step={2.5}
              bind:value={control.cornerRadiusPercentage}
            />
          </div>
          <div class="space-y-2.5">
            <Label class="text-foreground">画像のアスペクト比（幅：高さ）</Label
            >
            <div class="flex space-x-2 items-center">
              <Input
                type="number"
                min={1}
                bind:value={control.cellAspectRatio.width}
                class="text-sm w-20 h-8"
                onblur={() => {
                  if (!control.cellAspectRatio.width) {
                    control.cellAspectRatio.width = 1;
                  }
                }}
              />
              <span class="text-sm text-foreground">:</span>
              <Input
                type="number"
                min={1}
                bind:value={control.cellAspectRatio.height}
                class="text-sm w-20 h-8"
                onblur={() => {
                  if (!control.cellAspectRatio.height) {
                    control.cellAspectRatio.height = 1;
                  }
                }}
              />
            </div>
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
        <div class="flex flex-wrap gap-2 justify-end">
          <ClearControlButton onClear={onClearControl} />
          <ClearImagesButton onClear={onClearImages} />
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
