import { LocalStorageTable } from "./local-storage-table";
import { convertPathToKeyArray } from "./helpers";

export class LocalStorageDB {
    private dbName: string;
    constructor(dbName: string) {
        this.dbName = dbName;
    }
    public table<T>(tableName: string, keyPath: string) {
        return new LocalStorageTable<T>(tableName, convertPathToKeyArray(keyPath), this.dbName);
    }
}
