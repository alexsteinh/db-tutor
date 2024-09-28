<script>
  import { cn } from "$lib/utils";
  import * as ace from "ace-builds";
  import "ace-builds/src-noconflict/theme-monokai";
  import "ace-builds/src-noconflict/mode-sql";
  import { onDestroy, onMount } from "svelte";

  /** @type string */
  export let text;
  export let className = undefined;

  /** @type Element */
  let editorDiv;
  let editor;

  onMount(() => {
    editor = ace.edit(editorDiv);
    editor.setTheme("ace/theme/monokai");
    editor.setOption("minLines", 20);
    editor.setOption("maxLines", 30);
    const SqlMode = ace.require("ace/mode/sql").Mode;
    editor.session.setMode(new SqlMode());
    editor.session.setValue(text);
    editor.session.on("change", () => {
      text = editor.session.getValue();
    });
  });

  $: if (editor && text !== editor.getValue()) {
    editor.setValue(text, 1);
  }

  onDestroy(() => {
    editor?.destroy();
  });
</script>

<div bind:this={editorDiv} class={cn("h-[400px] w-[600px]", className)}></div>
