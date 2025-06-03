<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index";
  import Label from "./ui/label/label.svelte";
  import Switch from "./ui/switch/switch.svelte";

  let isPlacehoderVisible = $state(true);
</script>

<Accordion.Root type="single" class="border border-border rounded-lg">
  <Accordion.Item value="config-panel">
    <Accordion.Trigger class="px-4 hover:bg-secondary hover:no-underline">
      <span>設定</span>
    </Accordion.Trigger>
    <Accordion.Content class="px-4 pt-4 space-y-4.5">
      <div class="space-y-6">
        <div class="flex justify-between pb-0.5">
          <Label class="text-foreground">プレースホルダーの表示</Label>
          <Switch checked={isPlacehoderVisible} />
        </div>
      </div>
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
