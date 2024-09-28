export function initWorker() {
  const worker = new Worker(new URL("worker.js", import.meta.url), {
    type: "module",
  });
}
