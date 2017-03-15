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
declare module DotnetJs {
    class InvalidDataException extends Error {
        constructor(type: string);
    }
    class FormatException extends Error {
        constructor(msg?: string);
    }
    class NotImplementedExeption extends Error {
        constructor(methodName?: string);
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
declare module DotnetJs {
    abstract class ValueType {
        GetHashCode(refresh?: boolean): number;
    }
}
interface Object {
    ContainsKey: (key: string) => boolean;
    Equals: (obj: Object) => boolean;
    GetHashCode: (refresh?: boolean) => number;
    readonly IsValueType: boolean;
    hashCode: number;
}
declare module DotnetJs {
    class Version implements ICloneable, IComparable<Version>, IEquatable<Version> {
        private major;
        private minor;
        private build;
        private revision;
        constructor(major?: number, minor?: number, build?: number, revision?: number);
        Major: number;
        Minor: number;
        Build: number;
        Revision: number;
        Clone(): Version;
        CompareTo(obj: Version): number;
        Equals(obj: Version): boolean;
        toString(): string;
    }
}
declare module DotnetJs.Linq {
    function LinqStart<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource>;
    class LinqIntermediate<TSource, TResult> implements Collections.IEnumerable<TResult> {
        protected toResult: (item: TSource, index: number) => TResult;
        protected source: Collections.IEnumerable<TSource>;
        constructor(source: Collections.IEnumerable<TSource>, func: (item: TSource, index: number) => TResult);
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
        Reverse(): LinqIntermediate<TResult, TResult>;
        Select<UDes>(func: (item: TResult) => UDes): LinqIntermediate<TResult, UDes>;
        SequenceEqual(second: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TSource>): boolean;
        SkipWhile(predicate: (item: TResult, index: number) => boolean): LinqIntermediate<TResult, TResult>;
        TakeWhile(predicate: (item: TResult, index: number) => boolean): LinqIntermediate<TResult, TResult>;
        ToArray(): TResult[];
        ToDictionary<TKey, TElement>(keyValueSelector: (item: TResult) => Collections.KeyValuePair<TKey, TElement>): Collections.Dictionary<TKey, TElement>;
        ToList(): Collections.List<TResult>;
        Where(predicate: (item: TResult) => boolean): LinqIntermediate<TResult, TResult>;
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
    function Reverse<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource>;
    function Select<TSource, TResult>(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult): LinqIntermediate<TSource, TResult>;
    function SequenceEqual<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): boolean;
    function SkipWhile<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource, index: number) => boolean): LinqIntermediate<TSource, TSource>;
    function TakeWhile<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource, index: number) => boolean): LinqIntermediate<TSource, TSource>;
    function ToArray<TSource>(source: Collections.IEnumerable<TSource>): TSource[];
    function ToDictionary<TSource, TKey, TElement>(source: Collections.IEnumerable<TSource>, keyValueSelector: (item: TSource) => Collections.KeyValuePair<TKey, TElement>, keyComparer?: IEqualityComparer<TKey>): Collections.Dictionary<TKey, TElement>;
    function ToList<TSource>(source: Collections.IEnumerable<TSource>): Collections.List<TSource>;
    function Where<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): LinqIntermediate<TSource, TSource>;
}
declare module DotnetJs.Char {
    function IsControl(value: string, index?: number): boolean;
    function IsDigit(value: string, index?: number): boolean;
    function IsLetter(value: string, index?: number): boolean;
    function IsLower(value: string, index?: number): boolean;
    function IsPunctuation(value: string, index?: number): boolean;
    function IsSeparator(value: string, index?: number): boolean;
    function IsUpper(value: string, index?: number): boolean;
    function IsWhiteSpace(value: string, index?: number): boolean;
}
interface String extends DotnetJs.Collections.IEnumerable<number> {
    PadLeft(totalLength: number, paddingChar?: number | string): string;
    PadRight(totalLength: number, paddingChar?: number | string): string;
    StartsWith(value: string, ignoreCase?: boolean): any;
}
interface StringConstructor {
    Empty: string;
    Join(seperator: string, enumerable: DotnetJs.Collections.IEnumerable<string>): any;
    Format(value: string, ...args: any[]): string;
    IsNullOrEmpty(value: string): boolean;
    IsNullOrWhiteSpace(value: string): boolean;
}
declare class StringEnumerator implements DotnetJs.Collections.IEnumerator<number> {
    private source;
    private index;
    private current;
    constructor(str: String);
    MoveNext(): boolean;
    readonly Current: number;
    Reset(): void;
    Dispose(): void;
}
interface Console {
    writeLine(format?: string, ...args: any[]): any;
}
interface Number {
    toString(format: string | number): string;
}
interface NumberConstructor {
    TryParseInt(value: string, out: DotnetJs.OutParam<number>): any;
}
declare module DotnetJs {
    interface IDisposable {
        Dispose(): void;
    }
    interface ICloneable {
        Clone(): Object;
    }
    interface IComparable<T> {
        CompareTo(first: T, second: T): number;
    }
    interface IEquatable<T> {
        Equals(obj: T): boolean;
    }
    abstract class DefaultDelegate {
        static Predicate: () => boolean;
        static Action: () => void;
        static Func: () => any;
        static EmptyReturn: any;
        static EqualityComparer: IEqualityComparer<any>;
    }
    type OutParam<T> = (out) => void;
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
declare module DotnetJs.Collections {
    class Dictionary<TKey extends Object, TValue> implements IDictionary<TKey, TValue> {
        private buckets;
        private entries;
        private keyComparer;
        private count;
        private version;
        private freeList;
        private freeCount;
        constructor(capacity?: number, keyComparer?: IEqualityComparer<TKey>);
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
}
declare module DotnetJs.Collections {
    class LinkedList<T> implements ICollection<T> {
        private head;
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
declare module DotnetJs.Collections {
    class List<T extends Object> implements ICollection<T> {
        private items;
        private version;
        constructor(collection?: T[] | IEnumerable<T>);
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
