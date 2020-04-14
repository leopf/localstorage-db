export interface ILinkedDbItem<T> {
    value: T;
    currentKey: string;
    nextKey?: string;
    prevKey?: string;
}
