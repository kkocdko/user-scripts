(async () => {
  const data = {};
  const decoder = new TextDecoder();
  for (const { name: dbName } of await indexedDB.databases()) {
    data[dbName] = {};
    const req = indexedDB.open(dbName);
    await new Promise((r) => (req.onsuccess = r));
    for (const storeName of req.result.objectStoreNames) {
      data[dbName][storeName] = {};
      const transaction = req.result.transaction(storeName);
      const store = transaction.objectStore(storeName);
      const keysReq = store.getAllKeys();
      const valuesReq = store.getAll();
      await new Promise((r) => (transaction.oncomplete = r));
      for (const k of keysReq.result) {
        const v = valuesReq.result.shift();
        const item = { type: v.constructor.name }; //"String|Uint8Array"
        const str = item.type === "String" ? v : decoder.decode(v);
        item.value = encodeURIComponent(str);
        data[dbName][storeName][k] = item;
      }
    }
  }
  const link = document.createElement("a");
  link.download = "vscode-web-backup-test_" + Date.now() + ".json";
  link.href = "data:text/json," + encodeURIComponent(JSON.stringify(data));
  link.click();
})();

(async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.click();
  await new Promise((r) => (fileInput.onchange = r));
  const fileReader = new FileReader();
  fileReader.readAsText(fileInput.files[0]);
  await new Promise((r) => (fileReader.onload = r));
  const encoder = new TextEncoder();
  for (const { name } of await indexedDB.databases()) {
    const req = indexedDB.deleteDatabase(name);
    console.log("before");
    await new Promise((r) => (req.onblocked = req.onsuccess = req.onerror = r));
    console.log("after");
  }
  for (const [dbName, v] of Object.entries(JSON.parse(fileReader.result))) {
    const req = indexedDB.open(dbName);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      for (const storeName of Object.keys(v)) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      }
    };
    await new Promise((r) => (req.onsuccess = r));
    for (const [storeName, items] of Object.entries(v)) {
      const transaction = req.result.transaction(storeName, "readwrite");
      const oncomplete = new Promise((r) => (transaction.oncomplete = r));
      const store = transaction.objectStore(storeName);
      for (const [key, { type, value }] of Object.entries(items)) {
        const str = decodeURIComponent(value);
        const v = type === "String" ? str : encoder.encode(str);
        store.put(v, key);
      }
      await oncomplete;
    }
  }

  location.reload();
})();
