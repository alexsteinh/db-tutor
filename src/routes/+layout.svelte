<script>
  import "../app.css";
  import { ModeWatcher } from "mode-watcher";

  import { initWorker } from "$lib/sqlite/loadWorker";
  import { onMount } from "svelte";

  onMount(() => {
    initWorker();
  });
</script>

<ModeWatcher />
<slot />
