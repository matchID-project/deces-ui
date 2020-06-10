import { set, get, del, clear } from 'idb-keyval';

let db = undefined

export const clearAll = async () => {
    clear();
}


export const useLocalStorage = (store, key) => {
    const json = localStorage.getItem(key);
    if (json) {
        store.set(JSON.parse(json));
    }
    store.subscribe((value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(err) {
            console.log(`error while storing ${key} into localStorage:`, err);
        }
    });
};

export const useLocalSync = async (store, key) => {
    const json = await get(key) || localStorage.getItem(key);
    if (json) {
        try {
            store.set(JSON.parse(json));
        } catch(err) {
            console.log(err);
        }
    }
    store.subscribe(async (value) => {
        if ((value === null) || (value === undefined)) {
            try {
                localStorage.removeItem(key);
            } catch(err) {}
            try {
                await del(key);
            } catch(err) {}
        } else {
            const stringValue = JSON.stringify(value);
            if (stringValue.length < 1000000) {
                localStorage.setItem(key, stringValue);
            } else {
                try {
                    set(key, JSON.stringify(value));
                } catch(err) {
                    console.log(`error while storing ${key} into IndexedDB:`, err);
                }
            }
        }
    });
}
