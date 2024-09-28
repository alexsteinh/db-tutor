import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

const log = console.log;
const error = console.error;

let db;

onmessage = (event) => {
  log("Worker received message:", event.data);
  try {
    const result = executeQuery(event.data.sql);
    postMessage({ type: "result", result: result });
  } catch (err) {
    postMessage({ type: "result", error: err });
  }
};

const executeQuery = (sql) => {
  const columns = new Array();
  const start = performance.now();
  const rows = db.exec(sql, {
    returnValue: "resultRows",
    columnNames: columns,
    rowMode: "array",
  });
  const end = performance.now();
  return { columns, rows, elapsed: end - start };
};

const start = (sqlite3) => {
  log("Running SQLite3 version", sqlite3.version.libVersion);
  db =
    "opfs" in sqlite3
      ? new sqlite3.oo1.OpfsDb("/mydb.sqlite3")
      : new sqlite3.oo1.DB("/mydb.sqlite3", "ct");
  log(
    "opfs" in sqlite3
      ? `OPFS is available, created persisted database at ${db.filename}`
      : `OPFS is not available, created transient database ${db.filename}`
  );
  postMessage({ type: "ready", version: sqlite3.version.libVersion });
};

const initializeSQLite = async () => {
  try {
    log("Loading and initializing SQLite3 module...");
    const sqlite3 = await sqlite3InitModule({ print: log, printErr: error });
    log("Done initializing. Running demo...");
    start(sqlite3);
  } catch (err) {
    error("Initialization error:", err.name, err.message);
  }
};

initializeSQLite();
