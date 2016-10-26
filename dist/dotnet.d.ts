/**
 *
 *  The MIT License (MIT)
 *  Copyright (c) 2016 Master Yu
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 *  to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 *  and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 *  IN THE SOFTWARE.
 *
**/
interface Object {
    GetHashCode: Function;
    Equals: Function;
    readonly IsValueType: boolean;
    hashCode: number;
}
interface OutParam<T> {
    Value: T;
}
declare abstract class Crc32Bit {
    private static _crcTbl;
    private static LENGTH;
    private static _elemAt;
    static Init(): void;
    static ValueString(buf: string): number;
    static Value(buf: any, offset: number, length: number, elemAt?: (buf: any, index: number) => number): number;
}
interface Array<T> extends DotnetJs.Collections.IEnumerable<T> {
}
declare class ArrayEnumerator<T> implements DotnetJs.Collections.IEnumerator<T> {
    private index;
    private array;
    private current;
    constructor(array: T[]);
    MoveNext(): boolean;
    readonly Current: T;
    Reset(): void;
    Dispose(): void;
}
declare module DotnetJs.Arrays {
    function Copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void;
    function AddRange(array: any[], collection: any[], length?: number): void;
    function Clear(array: any[], freeIndex?: number, length?: number): void;
    function Sort(array: any[], index?: number, count?: number, comparison?: IComparer<any>): void;
    function IndexOf(array: any[], item: any, startIndex?: number, length?: number, comparer?: IEqualityComparer<any>): number;
    function LastIndexOf(array: any[], item: any, startIndex?: number, length?: number, comparer?: IEqualityComparer<any>): number;
}
declare module DotnetJs {
    class NotImplementedExeption extends Error {
        constructor(msg: string);
    }
    class UnknownExeption extends Error {
        constructor();
    }
    class ArgumentException extends Error {
        constructor(msg: string);
    }
    class ArgumentNullException extends Error {
        constructor(msg: string);
    }
    class ArgumentOutOfRangeException extends Error {
        constructor(msg: string);
    }
    class InvalidOperationException extends Error {
        constructor(msg: string);
    }
}
declare module DotnetJs.Collections {
    class LinkedList<T> implements ICollection<T> {
        head: LinkedListNode<T>;
        private count;
        private version;
        constructor(collection?: IEnumerable<T>);
        readonly Count: number;
        readonly First: LinkedListNode<T>;
        readonly Last: LinkedListNode<T>;
        readonly Version: number;
        readonly IsReadOnly: boolean;
        Add(value: T): void;
        AddAfter(node: LinkedListNode<T>, value: T): LinkedListNode<T>;
        AddBefore(node: LinkedListNode<T>, value: T): LinkedListNode<T>;
        AddFirst(value: T): LinkedListNode<T>;
        AddLast(value: T): LinkedListNode<T>;
        Clear(): void;
        Contains(value: T): boolean;
        CopyTo(array: T[], index: number): void;
        Find(value: T): LinkedListNode<T>;
        FindLast(value: T): LinkedListNode<T>;
        GetEnumerator(): IEnumerator<T>;
        Remove(value: T): boolean;
        RemoveFirst(): void;
        RemoveLast(): void;
        private InternalInsertNodeBefore(node, newNode);
        private InternalInsertNodeToEmptyList(newNode);
        InternalRemoveNode(node: LinkedListNode<T>): void;
        ValidateNewNode(node: LinkedListNode<T>): void;
        ValidateNode(node: LinkedListNode<T>): void;
        readonly IsSynchronized: boolean;
    }
    class LinkedListNode<T> {
        list: LinkedList<T>;
        next: LinkedListNode<T>;
        prev: LinkedListNode<T>;
        item: T;
        constructor(list: LinkedList<T>, value: T);
        readonly List: LinkedList<T>;
        readonly Next: LinkedListNode<T>;
        readonly Previous: LinkedListNode<T>;
        Value: T;
        Invalidate(): void;
    }
}
declare module DotnetJs {
    interface IDisposable {
        Dispose(): void;
    }
    abstract class DefaultDelegate {
        static Predicate: () => boolean;
        static Action: () => void;
        static Func: () => any;
        static EmptyReturn: any;
        static EqualityComparer: IEqualityComparer<any>;
    }
    type IEqualityComparer<T> = (a: T, b: T) => boolean;
    type IComparer<T> = (a: T, b: T) => number;
    function Greetings(): void;
}
declare module DotnetJs.Collections {
    interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
        readonly Count: number;
        readonly Keys: TKey[];
        readonly KeyValuePairs: KeyValuePair<TKey, TValue>[];
        readonly Values: TValue[];
        GetValue(key: TKey): TValue;
        SetValue(key: TKey, value: TValue): void;
        Add(key: TKey, value: TValue): void;
        Clear(): void;
        Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean;
        ContainsKey(key: TKey): boolean;
        ContainsValue(value: TValue): boolean;
        ForEach(action: (item: KeyValuePair<TKey, TValue>) => void): void;
        Remove(key: TKey): TValue;
        TryGetValue(key: TKey, out: OutParam<TValue>): boolean;
    }
    interface IEnumerator<T> extends IDisposable {
        readonly Current: T;
        MoveNext(): boolean;
        Reset(): void;
    }
    interface IEnumerable<T> {
        GetEnumerator(): IEnumerator<T>;
    }
    interface ICollection<T> extends IEnumerable<T> {
        readonly Count: number;
        readonly IsReadOnly: boolean;
        Add(item: T): void;
        Clear(): void;
        Contains(item: T): boolean;
        CopyTo(array: T[], arrayIndex: number): void;
        Remove(item: T): boolean;
    }
    type KeyValuePair<TKey, TValue> = {
        Key: TKey;
        Value: TValue;
    };
    class KeyNotFoundException extends Error {
        constructor(msg: string);
    }
}
declare module DotnetJs.Collections {
    class Dictionary<TKey extends Object, TValue> implements IDictionary<TKey, TValue> {
        private buckets;
        private entries;
        private count;
        private version;
        private freeList;
        private freeCount;
        constructor(capacity?: number);
        readonly Count: number;
        readonly Entries: {
            hashCode?: number;
            next?: number;
            key?: TKey;
            value?: TValue;
        }[];
        readonly Keys: TKey[];
        readonly KeyValuePairs: KeyValuePair<TKey, TValue>[];
        readonly Length: number;
        readonly Values: TValue[];
        readonly Version: number;
        GetValue(key: TKey): TValue;
        SetValue(key: TKey, value: TValue): void;
        Add(key: TKey, value: TValue): void;
        Clear(): void;
        Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean;
        ContainsKey(key: TKey): boolean;
        ContainsValue(value: TValue): boolean;
        private FindEntry(key);
        ForEach(action: (item: KeyValuePair<TKey, TValue>) => void): void;
        GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>;
        private Initialize(capacity);
        private Insert(key, value, add);
        private Resize();
        Remove(key: TKey): TValue;
        TryGetValue(key: TKey, out: OutParam<TValue>): boolean;
    }
    class Enumerator<TKey extends Object, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>> {
        private hashTable;
        private version;
        private index;
        private current;
        constructor(hashTable: Dictionary<TKey, TValue>);
        MoveNext(): boolean;
        readonly Current: KeyValuePair<TKey, TValue>;
        Reset(): void;
        Dispose(): void;
    }
}
declare module DotnetJs.Linq {
    function LinqStart<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource>;
    class LinqIntermediate<TSource, TResult> implements Collections.IEnumerable<TResult> {
        protected toResult: (item: TSource) => TResult;
        protected source: Collections.IEnumerable<TSource>;
        constructor(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult);
        GetEnumerator(): Collections.IEnumerator<TResult>;
        Aggregate<TAccumulate>(seed: TAccumulate, func: (acc: TAccumulate, item: TResult) => TAccumulate): TAccumulate;
        Average(): number;
        All(predicate: (item: TResult) => boolean): boolean;
        Any(predicate?: (item: TResult) => boolean): boolean;
        Concat(enumerable: Collections.IEnumerable<TResult>): LinqIntermediate<TResult, TResult>;
        Contains(element: TResult, comparer?: IEqualityComparer<TResult>): boolean;
        Count(predicate?: (item: TResult) => boolean): number;
        ElementAt(index: number): TResult;
        Except(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult>;
        First(predicate?: (item: TResult) => boolean): TResult;
        ForEach(action: (item: TResult) => void): void;
        IndexOf(element: TResult): number;
        Intersect(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult>;
        LastIndexOf(element: TResult): number;
        Max(comparer?: IComparer<TResult>): TResult;
        Min(comparer?: IComparer<TResult>): TResult;
        Select<UDes>(func: (item: TResult) => UDes): LinqIntermediate<TResult, UDes>;
        Where(predicate: (item: TResult) => boolean): LinqIntermediate<TResult, TResult>;
        ToArray(): TResult[];
        ToList(): Collections.List<TResult>;
    }
    function Aggregate<TSource, TAccumulate>(source: Collections.IEnumerable<TSource>, seed: TAccumulate, func: (acc: TAccumulate, item: TSource) => TAccumulate): TAccumulate;
    function Average(source: Collections.IEnumerable<number>): number;
    function All<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): boolean;
    function Any<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): boolean;
    function Concat<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource>;
    function Contains<TSource>(source: Collections.IEnumerable<TSource>, element: TSource, comparer?: IEqualityComparer<TSource>): boolean;
    function Count<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): number;
    function ElementAt<TSource>(source: Collections.IEnumerable<TSource>, index: number): TSource;
    function Except<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): LinqIntermediate<TSource, TSource>;
    function First<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): TSource;
    function ForEach<TSource>(source: Collections.IEnumerable<TSource>, action: (item: TSource) => void): void;
    function IndexOf<TSource>(source: Collections.IEnumerable<TSource>, element: TSource): number;
    function Intersect<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): LinqIntermediate<TSource, TSource>;
    function LastIndexOf<TSource>(source: Collections.IEnumerable<TSource>, element: TSource): number;
    function Max<TSource>(source: Collections.IEnumerable<TSource>, comparer?: IComparer<TSource>): TSource;
    function Min<TSource>(source: Collections.IEnumerable<TSource>, comparer?: IComparer<TSource>): TSource;
    function Range(start: number, count: number): LinqIntermediate<number, number>;
    function Repeat<TResult>(element: TResult, count: number): LinqIntermediate<TResult, TResult>;
    function Select<TSource, TResult>(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult): LinqIntermediate<TSource, TResult>;
    function ToArray<TSource>(source: Collections.IEnumerable<TSource>): TSource[];
    function ToList<TSource>(source: Collections.IEnumerable<TSource>): Collections.List<TSource>;
    function Where<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): LinqIntermediate<TSource, TSource>;
}
declare module DotnetJs.Collections {
    class List<T extends Object> implements ICollection<T> {
        private items;
        private version;
        constructor(collection?: T[]);
        readonly Count: number;
        readonly IsReadOnly: boolean;
        readonly Values: T[];
        GetValue(index: number): T;
        SetValue(index: number, value: T): void;
        readonly Version: number;
        Add(item: T): void;
        AddRange(collection: T[]): void;
        Clear(): void;
        Contains(item: T): boolean;
        CopyTo(array: any[], arrayIndex: number): void;
        Exists(match: (item: T) => boolean): boolean;
        Find(match: (item: T) => boolean): T;
        FindAll(match: (item: T) => boolean): List<T>;
        FindIndex(startIndex: number, count: number, match: (item: T) => boolean): number;
        FindLastIndex(startIndex: number, count: number, match: (item: T) => boolean): number;
        ForEach(action: (item: T) => void): void;
        GetEnumerator(): IEnumerator<T>;
        GetRange(index: number, count: number): List<T>;
        IndexOf(item: T): number;
        Remove(item: T): boolean;
        RemoveAll(match: (item: T) => boolean): number;
        RemoveAt(index: number): void;
        RemoveLast(): T;
        RemoveRange(index: number, count: number): void;
        Reverse(index: number, count: number): void;
        Sort(index: number, count: number, comparison: (a: T, b: T) => number): void;
        ToArray(): T[];
    }
}
declare module 'dotnetjs' {
    import dotnetjs = DotnetJs;
    export = dotnetjs;
}
declare module DotnetJs {
    abstract class ValueType {
        GetHashCode(refresh?: boolean): number;
    }
}
