<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index";
  import Button from "./ui/button/button.svelte";
  import Label from "./ui/label/label.svelte";
  import Slider from "./ui/slider/slider.svelte";
  import Switch from "./ui/switch/switch.svelte";
  import { Minus, Plus } from "lucide-svelte";

  let isPlacehoderVisible = $state(true);
  let imageSpacingRem = $state(0.5);
  let columnCount = $state(5);
  let rowCount = $state(4);
</script>

<Accordion.Root type="single" class="border border-border rounded-lg">
  <Accordion.Item value="config-panel">
    <Accordion.Trigger class="px-4 hover:bg-secondary hover:no-underline">
      <span class="text-xs">設定</span>
    </Accordion.Trigger>
    <Accordion.Content class="px-4 pt-4 space-y-4.5">
      <div class="space-y-6">
        <div class="flex justify-between pb-0.5">
          <Label class="text-foreground">プレースホルダーの表示</Label>
          <Switch bind:checked={isPlacehoderVisible} />
        </div>
        <div class="space-y-3.5 pb-1">
          <Label class="text-foreground">画像の間隔</Label>
          <Slider
            type="single"
            id="image-spacing-rem"
            min={0}
            max={1.5}
            step={0.25}
            bind:value={imageSpacingRem}
          />
        </div>
        <div class="space-y-2.5">
          <Label class="text-foreground">1行あたりの表示数</Label>
          <div class="flex items-center">
            <Button
              variant="secondary"
              class="size-7"
              onclick={() => {
                columnCount--;
              }}
              disabled={columnCount <= 1}
            >
              <Minus strokeWidth={2} className="size-4 text-foreground" />
            </Button>
            <div class="text-center w-12 text-foreground">{columnCount}</div>
            <Button
              variant="secondary"
              class="size-7"
              onclick={() => {
                columnCount++;
              }}
              disabled={columnCount >= 10}
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
                rowCount--;
              }}
              disabled={rowCount <= 1}
            >
              <Minus strokeWidth={2} className="size-4 text-foreground" />
            </Button>
            <div class="text-center w-12 text-foreground">{rowCount}</div>
            <Button
              variant="secondary"
              class="size-7"
              onclick={() => {
                rowCount++;
              }}
              disabled={rowCount >= 10}
            >
              <Plus strokeWidth={2} className="size-4 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
