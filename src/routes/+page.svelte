<script>
  import Editor from "$lib/components/editor.svelte";
  import { Button } from "$lib/components/ui/button";
  import { table } from "table";
  import { onMount } from "svelte";

  /** @type Worker */
  let worker;
  let sqliteVersion;

  $: databaseReady = !!sqliteVersion;

  let text = `with Professoren (persnr, name, rang, raum, gehalt, steuerklasse) as (
values (2125,'Sokrates','C4',226,85000,1),
       (2126,'Russel','C4',232,80000,3),
       (2127,'Kopernikus','C3',310,65000,5),
       (2128,'Aristoteles','C4',250,85000,1),
       (2133,'Popper','C3',52,68000,1),
       (2134,'Augustinus','C3',309,55000,5),
       (2136,'Curie','C4',36,95000,3),
       (2137,'Kant','C4',7,98000,1)
)

SELECT * from professoren`;
  let result;

  $: resultTable = !!result && table([[...result.columns], ...result.rows]);

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
    worker.postMessage({ type: "exec", sql: text });
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="flex min-h-svh flex-col p-2">
  <main class="flex flex-1 flex-col gap-3">
    <Editor className="w-full rounded-sm" bind:text />
    <div>
      <Button on:click={execute} disabled={!databaseReady}>Execute</Button>
    </div>
    <div>
      {#if !result}
        <p class="mb-1 ml-1 font-mono text-xs text-zinc-500">Output</p>
      {:else}
        <p class="mb-1 ml-1 font-mono text-xs text-zinc-500">
          Output ({result.rows.length} rows)
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
      SQLite version: {sqliteVersion}
    {/if}
  </footer>
</div>
