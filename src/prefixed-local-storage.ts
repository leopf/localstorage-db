export class SingleLocalStorage<T> {

    private defaultValue: T;
    private storage: PrefixedLocalStorage<T>;

    constructor(key: string, defaultValue: T) {
        this.storage = new PrefixedLocalStorage<T>(key);
        this.defaultValue = defaultValue;
    }

    public get() {
        return (this.storage.get("") as T) || this.defaultValue;
    }
    public set(item: T) {
        this.storage.set("", item);
    }
    public delete() {
        this.storage.delete("");
    }
}
export class PrefixedLocalStorage<T> {

    private cacheMap: Map<string, T> = new Map<string, T>();
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    public has(topKey: string) {
        if (this.cacheMap.has(topKey)) {
            return true;
        }
        const key = this.prefix + "_" + topKey;
        return !!window.localStorage.getItem(key);
    }
    public set(topKey: string, item: T) {
        this.cacheMap.set(topKey, item);
        const key = this.prefix + "_" + topKey;
        if (item) {
            const itemString = JSON.stringify(item);
            window.localStorage.setItem(key, itemString);
        }
    }
    public get<T>(topKey: string) : T | undefined {
        if (this.cacheMap.has(topKey)) {
            return this.cacheMap.get(topKey) as T | undefined;
        }
        const key = this.prefix + "_" + topKey;
        const itemString = window.localStorage.getItem(key);
        if (itemString) {
            return JSON.parse(itemString) as T | undefined;
        }
        else {
            return undefined;
        }
    }
    public delete(topKey: string) {
        this.cacheMap.delete(topKey);
        const key = this.prefix + "_" + topKey;
        window.localStorage.removeItem(key);
    }
}
