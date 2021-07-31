(async function exportData() {
  const json = {};
  const decoder = new TextDecoder();
  for (const { name: dbName } of await indexedDB.databases()) {
    json[dbName] = {};
    const req = indexedDB.open(dbName);
    await new Promise((r) => (req.onsuccess = r));
    for (const storeName of req.result.objectStoreNames) {
      json[dbName][storeName] = {};
      const transaction = req.result.transaction(storeName);
      const store = transaction.objectStore(storeName);
      const keysReq = store.getAllKeys();
      const valuesReq = store.getAll();
      await new Promise((r) => (transaction.oncomplete = r));
      for (const k of keysReq.result) {
        const v = valuesReq.result.shift();
        const item = { type: v.constructor.name }; // String | Uint8Array
        const str = item.type === "String" ? v : decoder.decode(v);
        item.value = encodeURIComponent(str);
        json[dbName][storeName][k] = item;
      }
    }
  }
  const link = document.createElement("a");
  link.download = "vscode-web-backup_" + Date.now() + ".json";
  link.href = "data:text/json," + encodeURIComponent(JSON.stringify(json));
  link.click();
})();

(async function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.click();
  await new Promise((r) => (input.onchange = r));
  const reader = new FileReader();
  reader.readAsText(input.files[0]);
  await new Promise((r) => (reader.onload = r));
  const encoder = new TextEncoder();
  for (const [dbName, dbData] of Object.entries(JSON.parse(reader.result))) {
    const req = indexedDB.open(dbName);
    req.onupgradeneeded = ({ target: { result: db } }) =>
      Object.keys(dbData).forEach((name) => db.createObjectStore(name));
    await new Promise((r) => (req.onsuccess = r));
    for (const [storeName, storeData] of Object.entries(dbData)) {
      const transaction = req.result.transaction(storeName, "readwrite");
      const store = transaction.objectStore(storeName);
      store.clear(); // Avoid config conflict
      for (const [key, { type, value }] of Object.entries(storeData)) {
        const str = decodeURIComponent(value);
        store.put(type === "String" ? str : encoder.encode(str), key);
      }
      await new Promise((r) => (transaction.oncomplete = r));
    }
  }
  location.reload();
})();
