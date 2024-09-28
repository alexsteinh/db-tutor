<script>
  import { cn } from "$lib/utils";
  import * as ace from "ace-builds";
  import { onDestroy, onMount } from "svelte";

  /** @type string */
  export let text;
  export let className = undefined;

  /** @type Element */
  let editorDiv;
  let editor;

  onMount(() => {
    editor = ace.edit(editorDiv);
    editor.session.setValue(text);
    editor.session.on("change", () => {
      text = editor.session.getValue();
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });
</script>

<div bind:this={editorDiv} class={cn("h-[400px] w-[600px]", className)}></div>
