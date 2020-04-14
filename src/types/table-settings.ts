export interface ITableSettings {
    firstKey?: string;
    lastKey?: string;
}

export function defaultTableSettings() {
    return {
        firstKey: undefined,
        lastKey: undefined
    } as ITableSettings;
}