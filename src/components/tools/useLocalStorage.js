import { set, get, del, clear } from 'idb-keyval';

export const clearAll = async () => {
    clear();
}

export const useLocalSync = async (store, key) => {
    let json;
    try {
        json = await get(key) || localStorage.getItem(key);
    } catch(e) {
        json = localStorage.getItem(key);
    }
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
                    // lazy sync as storing idb hangs UI
                    setTimeout(() => set(key, JSON.stringify(value)), 100);
                } catch(err) {
                    console.log(`error while storing ${key} into IndexedDB:`, err);
                }
            }
        }
    });
}
