/// <reference path="../Collections/prim.ts" />

interface Array<T> extends DotnetJs.Collections.IEnumerable<T> { }

class ArrayEnumerator<T> implements DotnetJs.Collections.IEnumerator<T> {

    private index: number;
    private array: T[];
    private current: T;

    constructor(array: T[]) {
        this.array = array;
        this.index = 0;
        this.current = null;
    }

    public MoveNext(): boolean {
        if (this.index >= this.array.length)
            return false;

        this.current = this.array[this.index++];
        return true;
    }

    public get Current(): T {
        return this.current;
    }

    public Reset(): void {
        this.index = 0;
    }

    public Dispose(): void {

    }
}

module DotnetJs.Arrays {

    export function Copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void {
        if (sourceArray == null)
            throw new ArgumentNullException('sourceArray');
        if (destinationArray == null)
            throw new ArgumentNullException('destinationArray');
        for (var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    }

    export function AddRange(array: any[], collection: any[], length?: number): void {
        if (array == null)
            throw new ArgumentNullException('array');
        if (collection == null)
            throw new ArgumentNullException('collection');
        length = length || collection.length;
        var startIndex = array.length;
        for (var i = 0; i < length; i++) {
            let index = startIndex + i;
            array[index] = collection[i];
        }
    }

    export function Clear(array: any[], freeIndex: number = 0, length?: number): void {
        if (array == null)
            throw new ArgumentNullException('array');
        var restIndex: number = length ? freeIndex + length : array.length;
        var rest = array.length - restIndex;
        if (rest > 0) {
            for (var i = 0; i < rest; i++) {
                array[freeIndex + i] = array[freeIndex + i];
            }
            array.length = freeIndex + rest;
            return;
        }
        array.length = freeIndex;
    }

    export function Sort(array: any[], index?: number, count?: number, comparison?: IComparer<any>): void {
        if (array == null)
            throw new ArgumentNullException('array');
        index = index || 0;
        var end = count ? index + count : null;
        var subArr = array.slice(index, end);
        subArr.sort(comparison);
        for (var i = 0; i < subArr.length; i++) {
            array[index + i] = subArr[i];
        }
    }

    export function IndexOf(array: any[], item: any, startIndex?: number, length?: number, comparer?: IEqualityComparer<any>): number {
        if (array == null)
            throw new ArgumentNullException('array');
        startIndex = startIndex || 0;
        length = length || (array.length - startIndex);
        comparer = comparer || DefaultDelegate.EqualityComparer;
        for (var i = startIndex; i < length; i++) {
            if (comparer(array[i], item))
                return i;
        }
        return -1;
    }

    export function LastIndexOf(array: any[], item: any, startIndex?: number, length?: number, comparer?: IEqualityComparer<any>): number {
        if (!array)
            throw new ArgumentNullException('array');
        startIndex = startIndex || 0;
        length = length || (array.length - startIndex);
        comparer = comparer || DefaultDelegate.EqualityComparer;
        for (var i = startIndex + length - 1; i > startIndex; i--) {
            if (comparer(array[i], item))
                return i;
        }
        return -1;
    }
}

