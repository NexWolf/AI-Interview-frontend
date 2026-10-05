import {IDBPDatabase, openDB} from "idb"
const DB_NAME = "onboarding"
const STORE_NAME = "formSteps"
const DB_VERSION = 1;

/* to use the same connect with indexed database */
let dbPromise : Promise<IDBPDatabase> | null  = null;


/* if the database unfouned here we build database  */
export async function getDB() {
if(!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION,  {upgrade(db) {
    if(!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME)
    }
}}) 
}
return dbPromise;
}

export const dbStore = {
save : async (key : string, data :unknown) => {
        const db = await getDB();
        await db.put(STORE_NAME, data , key)
    },
    get : async <T>(key : string) : Promise<T | undefined> => {
        const db = await getDB();
        return  db.get(STORE_NAME, key) as Promise<T | undefined>
    },
    getAll : async <T = unknown> () : Promise<Record<string , T>> => {
        const db = await getDB();
        const keys = await db.getAllKeys(STORE_NAME);
        const values = await db.getAll(STORE_NAME);
        return Object.fromEntries(keys.map((k, i) => [String(k), values[i] as T]) )
    },
    delete : async (key : string) : Promise<void> => {
        const db = await getDB();
        await db.delete(STORE_NAME , key);
    },
    clear : async () => {
        const db = await getDB();
        await db.clear(STORE_NAME);
    }
}
