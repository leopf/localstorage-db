import { PrefixedLocalStorage, SingleLocalStorage } from "./prefixed-local-storage";
import { getValueViaKeyArray } from "./helpers";
import { ITableSettings, defaultTableSettings } from "./types/table-settings";
import { ILinkedDbItem } from "./types/linked-db-item";

export class LocalStorageTable<T> {
    private itemStorage: PrefixedLocalStorage<ILinkedDbItem<T>>;
    private settingsStorage: SingleLocalStorage<ITableSettings>;
    private keyArray: string[];
    constructor(tableName: string, keyArray: string[], prefix: string) {
        this.keyArray = keyArray;
        this.settingsStorage = new SingleLocalStorage<ITableSettings>(`${prefix}_${tableName}_settings`, defaultTableSettings());
        this.itemStorage = new PrefixedLocalStorage<ILinkedDbItem<T>>(`${prefix}_${tableName}_item`);
    }
    public add(item: T) {
        const tableSettings = this.settingsStorage.get();
        const keyValue = String(getValueViaKeyArray(this.keyArray, item));
        if (!keyValue) {
            throw new Error("Key not set in item.");
        }
        if (this.itemStorage.has(keyValue)) {
            throw new Error("Key already exists.");
        }
        const nItem: ILinkedDbItem<T> = {
            currentKey: keyValue,
            value: item,
            prevKey: tableSettings.lastKey,
            nextKey: undefined
        };
        if (tableSettings.lastKey) {
            const lastItemInfo = this.itemStorage.get(tableSettings.lastKey) as ILinkedDbItem<T>;
            lastItemInfo.nextKey = nItem.currentKey;
            this.itemStorage.set(lastItemInfo.currentKey, lastItemInfo);
            tableSettings.lastKey = nItem.currentKey;
        }
        else {
            tableSettings.firstKey = nItem.currentKey;
            tableSettings.lastKey = nItem.currentKey;
        }
        this.itemStorage.set(nItem.currentKey, nItem);
        this.settingsStorage.set(tableSettings);
    }
    public update(item: T) {
        const keyValue = String(getValueViaKeyArray(this.keyArray, item));
        if (!keyValue) {
            throw new Error("Key not set in item.");
        }
        if (!this.itemStorage.has(keyValue)) {
            throw new Error("Key does not exists.");
        }
        const itemInfo = this.itemStorage.get(keyValue) as ILinkedDbItem<T>;
        itemInfo.value = item;
        this.itemStorage.set(itemInfo.currentKey, itemInfo);
    }
    public delete(item: T) {
        const keyValue = String(getValueViaKeyArray(this.keyArray, item));
        if (!keyValue) {
            throw new Error("Key not set in item.");
        }
        this.deleteByKey(keyValue);
    }
    public deleteByKey(keyValue: string) {
        if (!this.itemStorage.has(keyValue)) {
            throw new Error("Key does not exists.");
        }
        const itemInfo = this.itemStorage.get(keyValue) as ILinkedDbItem<T>;
        const tableSettings = this.settingsStorage.get();
        if (!itemInfo.prevKey) {
            tableSettings.firstKey = itemInfo.nextKey;
        }
        if (!itemInfo.nextKey) {
            tableSettings.lastKey = itemInfo.prevKey;
        }
        this.settingsStorage.set(tableSettings);
        if (itemInfo.nextKey && itemInfo.prevKey) {
            let pItemInfo: ILinkedDbItem<T> = this.itemStorage.get(itemInfo.prevKey) as ILinkedDbItem<T>;
            let nItemInfo: ILinkedDbItem<T> = this.itemStorage.get(itemInfo.nextKey) as ILinkedDbItem<T>;
            pItemInfo.nextKey = nItemInfo.currentKey;
            nItemInfo.prevKey = pItemInfo.currentKey;
            this.itemStorage.set(pItemInfo.currentKey, pItemInfo);
            this.itemStorage.set(nItemInfo.currentKey, nItemInfo);
        }
        else if (itemInfo.nextKey && !itemInfo.prevKey) {
            let nItemInfo: ILinkedDbItem<T> = this.itemStorage.get(itemInfo.nextKey) as ILinkedDbItem<T>;
            nItemInfo.prevKey = undefined;
            this.itemStorage.set(nItemInfo.currentKey, nItemInfo);
        }
        else if (!itemInfo.nextKey && itemInfo.prevKey) {
            let pItemInfo: ILinkedDbItem<T> = this.itemStorage.get(itemInfo.prevKey) as ILinkedDbItem<T>;
            pItemInfo.nextKey = undefined;
            this.itemStorage.set(pItemInfo.currentKey, pItemInfo);
        }
        this.itemStorage.delete(keyValue);
    }
    public getByKey(keyValue: string) {
        if (!this.itemStorage.has(keyValue)) {
            throw new Error("Key does not exists.");
        }
        const itemInfo = this.itemStorage.get(keyValue) as ILinkedDbItem<T>;
        return itemInfo.value as T;
    }
    public items() {
        const tableSettings = this.settingsStorage.get();
        let currentKey = tableSettings.firstKey;
        const result: T[] = [];
        while (currentKey) {
            const currentItem = this.itemStorage.get(currentKey) as ILinkedDbItem<T>;
            result.push(currentItem.value);
            currentKey = currentItem.nextKey;
        }
        return result;
    }
}
