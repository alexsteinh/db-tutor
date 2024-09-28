<script>
  import Editor from "$lib/components/editor.svelte";
  import { Button } from "$lib/components/ui/button";
  import * as Select from "$lib/components/ui/select";
  import { schemas } from "$lib/schemas";
  import { table } from "table";
  import { onMount } from "svelte";

  let selectedSchema = schemas["Unischema"];

  /** @type Worker */
  let worker;
  let sqliteVersion;

  $: databaseReady = !!sqliteVersion;

  let text = "";
  let result;

  $: resultTable = !!result && table([[...result.columns], ...result.rows]);
  $: resultElapsed =
    !!result &&
    (result.elapsed < 1000
      ? `${result.elapsed.toFixed(2)} ms`
      : `${(result.elapsed / 1000).toFixed(2)} s`);

  onMount(() => {
    worker = new Worker(new URL("$lib/sqlite/worker.js", import.meta.url), {
      type: "module",
    });
    worker.addEventListener("message", (event) => {
      console.log("Message from worker:", event.data);
      switch (event.data.type) {
        case "ready":
          sqliteVersion = event.data.version;
          break;
        case "result":
          result = event.data.result;
          break;
      }
    });
  });

  function handleKeydown(event) {
    if (event.metaKey && event.key === "Enter") {
      execute();
    }
  }

  function execute() {
    if (!databaseReady) return;
    worker.postMessage({
      type: "exec",
      sql: (() => {
        if (selectedSchema) return selectedSchema.sql + "\n" + text;
        return text;
      })(),
    });
  }

  function schemaChanged() {
    text = selectedSchema.exampleQuery;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex min-h-svh flex-col p-2">
  <main class="flex flex-1 flex-col gap-3">
    <Editor className="w-full rounded-sm" bind:text />
    <div class="flex gap-3">
      <Button on:click={execute} disabled={!databaseReady}>Execute</Button>
      <Select.Root selected={selectedSchema} onSelectedChange={schemaChanged}>
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
    </div>
    <div>
      {#if !result}
        <p class="mb-1 ml-1 font-mono text-xs text-zinc-500">Output</p>
      {:else}
        <p class="mb-1 ml-1 font-mono text-xs text-zinc-500">
          Output ({result.rows.length} rows, {resultElapsed})
        </p>
      {/if}
      <p
        class="overflow-hidden whitespace-pre-wrap rounded-sm bg-zinc-800 p-2 font-mono text-xs"
      >
        {#if result}
          {resultTable}
        {:else}
          No result
        {/if}
      </p>
    </div>
  </main>
  <footer class="mt-2 text-center font-mono text-xs text-zinc-500">
    {#if databaseReady}
      sqlite-wasm v{sqliteVersion}
    {/if}
  </footer>
</div>
