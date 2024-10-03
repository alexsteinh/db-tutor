<script>
  import { schemas } from "$lib/schemas";
  import * as Select from "$lib/components/ui/select";

  export let selectedSchema;
</script>

<Select.Root selected={selectedSchema}>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Schema" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#each Object.values(schemas) as schema}
        <Select.Item value={schema} label={schema.name}
          >{schema.name}</Select.Item
        >
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
