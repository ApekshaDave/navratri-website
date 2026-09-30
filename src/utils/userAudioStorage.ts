// IndexedDB Storage Utility for User Audio References

const DB_NAME = 'NavSwarUserAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_audio_references';

interface StoredAudioRecord {
  garbaId: string;
  blob: Blob;
  fileName?: string;
  mimeType: string;
  duration?: string;
  updatedAt: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'garbaId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveUserAudioRecord = async (
  garbaId: string,
  blob: Blob,
  fileName?: string,
  duration?: string
): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record: StoredAudioRecord = {
      garbaId,
      blob,
      fileName,
      mimeType: blob.type || 'audio/webm',
      duration,
      updatedAt: Date.now(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getUserAudioRecord = async (
  garbaId: string
): Promise<StoredAudioRecord | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(garbaId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const deleteUserAudioRecord = async (garbaId: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(garbaId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
