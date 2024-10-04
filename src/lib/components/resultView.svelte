<script>
  import { table } from "table";

  export let result;

  $: resultTable = !!result && table([[...result.columns], ...result.rows]);
  $: resultElapsed =
    !!result &&
    (result.elapsed < 1000
      ? `${result.elapsed.toFixed(2)} ms`
      : `${(result.elapsed / 1000).toFixed(2)} s`);
</script>

<div>
  {#if !result}
    <p class="mb-1 ml-1 font-mono text-xs text-muted-foreground">Output</p>
  {:else}
    <p class="mb-1 ml-1 font-mono text-xs text-muted-foreground">
      Output ({result.rows.length} rows, {resultElapsed})
    </p>
  {/if}
  <p
    class="overflow-hidden whitespace-pre-wrap rounded-sm bg-muted p-2 font-mono text-xs"
  >
    {#if result}
      {resultTable}
    {:else}
      No result
    {/if}
  </p>
</div>
