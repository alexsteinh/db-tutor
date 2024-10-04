<script>
  import { ModeWatcher } from "mode-watcher";
  import Editor from "$lib/components/editor.svelte";
  import { Button } from "$lib/components/ui/button";
  import { onMount } from "svelte";
  import SchemaSelect from "$lib/components/schemaSelect.svelte";
  import ResultView from "$lib/components/resultView.svelte";

  /** @type Worker */
  let worker;
  let sqliteVersion;

  $: databaseReady = !!sqliteVersion;
  let result;

  let selectedSchema;
  let text = "";
  let prevSchema = null;

  $: {
    if (selectedSchema !== prevSchema) {
      text = selectedSchema?.exampleQuery ?? "";
      prevSchema = selectedSchema;
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
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
      sql: selectedSchema ? `${selectedSchema.sql}\n${text}` : text,
    });
  }
</script>

<ModeWatcher />
<div class="flex min-h-svh flex-col p-2">
  <main class="flex flex-1 flex-col gap-3">
    <Editor className="w-full rounded-sm" bind:text />
    <div class="flex gap-3">
      <Button on:click={execute} disabled={!databaseReady}>Execute</Button>
      <SchemaSelect bind:selectedSchema />
    </div>
    <ResultView {result} />
  </main>
  <footer class="mt-2 text-center font-mono text-xs text-muted-foreground">
    {#if databaseReady}
      sqlite-wasm v{sqliteVersion}
    {/if}
  </footer>
</div>
