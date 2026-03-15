export type GifTransferPayload = {
  blob: Blob;
  fileName: string;
  mimeType?: string;
};

type StoredGifTransfer = GifTransferPayload & {
  id: string;
  createdAt: number;
};

const DB_NAME = "web-tool-box";
const STORE_NAME = "gif-transfer";
const SESSION_PREFIX = "gif-transfer:";

type SessionStoredGifTransfer = {
  id: string;
  createdAt: number;
  fileName: string;
  mimeType?: string;
  dataUrl: string;
};

type TransferWindow = Window & {
  __webToolBoxGifTransfers?: Map<string, StoredGifTransfer>;
};

function getWindowTransferStore(): Map<string, StoredGifTransfer> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const transferWindow = window as TransferWindow;
  if (!transferWindow.__webToolBoxGifTransfers) {
    transferWindow.__webToolBoxGifTransfers = new Map<string, StoredGifTransfer>();
  }

  return transferWindow.__webToolBoxGifTransfers;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to serialize GIF transfer payload."));
    reader.readAsDataURL(blob);
  });
}

function readDataUrlAsBlob(dataUrl: string, mimeType?: string): Blob {
  const [header, base64 = ""] = dataUrl.split(",");
  const derivedMimeType = mimeType ?? header.match(/data:(.*?);base64/i)?.[1] ?? "image/gif";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: derivedMimeType });
}

async function saveGifTransferToSessionStorage(
  id: string,
  payload: GifTransferPayload
): Promise<void> {
  if (typeof window === "undefined" || !window.sessionStorage) {
    throw new Error("Session storage is not available in this environment.");
  }

  const record: SessionStoredGifTransfer = {
    id,
    createdAt: Date.now(),
    fileName: payload.fileName,
    mimeType: payload.mimeType ?? payload.blob.type ?? "image/gif",
    dataUrl: await readBlobAsDataUrl(payload.blob),
  };

  window.sessionStorage.setItem(`${SESSION_PREFIX}${id}`, JSON.stringify(record));
}

function loadGifTransferFromSessionStorage(id: string): StoredGifTransfer | null {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }

  const stored = window.sessionStorage.getItem(`${SESSION_PREFIX}${id}`);
  if (!stored) {
    return null;
  }

  const record = JSON.parse(stored) as SessionStoredGifTransfer;
  return {
    id: record.id,
    createdAt: record.createdAt,
    fileName: record.fileName,
    mimeType: record.mimeType,
    blob: readDataUrlAsBlob(record.dataUrl, record.mimeType),
  };
}

function removeGifTransferFromSessionStorage(id: string): void {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return;
  }

  window.sessionStorage.removeItem(`${SESSION_PREFIX}${id}`);
}

function openGifTransferDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Failed to open the GIF transfer database."));
  });
}

function runStoreRequest<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openGifTransferDb();
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = callback(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("GIF transfer database request failed."));
      transaction.oncomplete = () => db.close();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("GIF transfer transaction failed."));
    } catch (error) {
      reject(error);
    }
  });
}

export async function saveGifTransfer(payload: GifTransferPayload): Promise<string> {
  const id = `gif-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const record: StoredGifTransfer = {
    id,
    createdAt: Date.now(),
    fileName: payload.fileName,
    mimeType: payload.mimeType ?? payload.blob.type ?? "image/gif",
    blob: payload.blob,
  };

  const memoryStore = getWindowTransferStore();
  memoryStore?.set(id, record);

  try {
    await runStoreRequest("readwrite", (store) => store.put(record));
  } catch {
    try {
      await saveGifTransferToSessionStorage(id, payload);
    } catch {
      // Same-tab memory transfer is already populated above.
    }
  }

  return id;
}

export async function loadGifTransfer(id: string): Promise<StoredGifTransfer | null> {
  const memoryStore = getWindowTransferStore();
  const memoryRecord = memoryStore?.get(id);
  if (memoryRecord) {
    return memoryRecord;
  }

  try {
    const result = await runStoreRequest<StoredGifTransfer | undefined>("readonly", (store) =>
      store.get(id)
    );

    if (result) {
      return result;
    }
  } catch {
    // Fall through to session storage lookup.
  }

  return loadGifTransferFromSessionStorage(id);
}

export async function removeGifTransfer(id: string): Promise<void> {
  const memoryStore = getWindowTransferStore();
  memoryStore?.delete(id);

  try {
    await runStoreRequest("readwrite", (store) => store.delete(id));
  } catch {
    // Ignore IndexedDB cleanup failures and continue with session storage cleanup.
  }

  removeGifTransferFromSessionStorage(id);
}
