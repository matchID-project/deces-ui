export const useLocalStorage = (store, key) => {
	const json = localStorage.getItem(key);
	if (json) {
		store.set(JSON.parse(json));
	}
    try {
        store.subscribe((value) => {
            localStorage.setItem(key, JSON.stringify(value));
        });
    } catch(err) {
        console.error('useLocalStorage failed',err);
    }
}
