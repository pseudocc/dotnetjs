/// <reference path="../utils/objext.ts" />
/// <reference path="../utils/array.ts" />
/// <reference path="../utils/errors.ts" />
/// <reference path="./prim.ts" />

module DotnetJs.Collections {

    export class Dictionary<TKey extends Object, TValue> implements IDictionary<TKey, TValue>
    {
        private buckets: number[];
        private entries: {
            hashCode?: number;
            next?: number;
            key?: TKey;
            value?: TValue;
        }[];
        private keyComparer: IEqualityComparer<TKey>;
        private count: number;
        private version: number;
        private freeList: number;
        private freeCount: number;

        constructor(capacity?: number, keyComparer?: IEqualityComparer<TKey>) {
            this.keyComparer = keyComparer;
            capacity = capacity || 0;
            if (capacity < 0)
                throw new ArgumentOutOfRangeException('capacity < 0');
            if (capacity > 0)
                this.Initialize(capacity);
        }

        public get Count(): number {
            return this.count - this.freeCount;
        }

        public get Entries() {
            return this.entries;
        }

        public get Keys(): TKey[] {
            var keys: TKey[] = [];
            if (this.Count == 0)
                return keys;
            for (var i = 0; i < this.count; i++) {
                if (this.entries[i].hashCode < 0)
                    return;

                keys.push(this.entries[i].key);
            }
            return keys;
        }

        public get KeyValuePairs(): KeyValuePair<TKey, TValue>[] {
            var pairs: KeyValuePair<TKey, TValue>[] = [];
            if (this.Count == 0)
                return pairs;
            for (var i = 0; i < this.count; i++) {
                let pair: KeyValuePair<TKey, TValue> = { Key: this.entries[i].key, Value: this.entries[i].value };
                pairs.push(pair);
            }
            return pairs;
        }

        public get Length(): number {
            return this.count;
        }

        public get Values(): TValue[] {
            var values: TValue[] = [];
            if (this.Count == 0)
                return values;
            for (var i = 0; i < this.count; i++) {
                if (this.entries[i].hashCode < 0)
                    return;

                values.push(this.entries[i].value);
            }
            return values;
        }

        public get Version(): number {
            return this.version;
        }

        public GetValue(key: TKey): TValue {
            var i: number = this.FindEntry(key);
            if (i >= 0)
                return this.entries[i].value;
            throw new KeyNotFoundException(key);
        }

        public SetValue(key: TKey, value: TValue): void {
            this.Insert(key, value, false);
        }

        public Add(key: TKey, value: TValue): void {
            this.Insert(key, value, true);
        }

        public Clear(): void {
            if (this.count > 0) {
                for (var i = 0; i < this.buckets.length; i++)
                    this.buckets[i] = -1;
                Arrays.Clear(this.entries, 0, this.count);
                this.freeList = -1;
                this.count = 0;
                this.freeCount = 0;
                this.version++;
            }
        }

        public Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean {
            var i: number = this.FindEntry(keyValuePair.Key);
            var comparer: IEqualityComparer<TValue> = DefaultDelegate.EqualityComparer;
            if (i >= 0 && comparer(this.entries[i].value, keyValuePair.Value)) {
                return true;
            }
            return false;
        }

        public ContainsKey(key: TKey): boolean {
            return this.FindEntry(key) >= 0;
        }

        public ContainsValue(value: TValue): boolean {
            var comparer: IEqualityComparer<TValue> = DefaultDelegate.EqualityComparer;
            if (value == null) {
                for (var i = 0; i < this.count; i++) {
                    if (this.entries[i].hashCode >= 0 && this.entries[i].value == null)
                        return true;
                }
            }
            else {
                for (var i = 0; i < this.count; i++) {
                    if (this.entries[i].hashCode >= 0 && comparer(this.entries[i].value, value))
                        return true;
                }
            }
            return false;
        }

        private FindEntry(key: TKey): number {
            if (key == null) {
                throw new ArgumentNullException(key.toString());
            }
            var comparer: IEqualityComparer<TKey> = this.keyComparer || DefaultDelegate.EqualityComparer;
            if (this.buckets != null) {
                var hashCode: number = key.GetHashCode() & 0x7FFFFFFF;
                for (var i: number = this.buckets[hashCode % this.buckets.length]; i >= 0; i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && comparer(this.entries[i].key, key))
                        return i;
                }
            }
            return -1;
        }

        public ForEach(action: (item: KeyValuePair<TKey, TValue>) => void) {
            if (action == null) {
                throw new ArgumentNullException('action');
            }
            if (this.Count == 0)
                return;
            var version: number = this.version;
            for (var i = 0; i < this.count; i++) {
                var pair: KeyValuePair<TKey, TValue> = { Key: this.entries[i].key, Value: this.entries[i].value };
                action(pair);
            }
            if (version != this.version)
                throw new InvalidOperationException('version failed');
        }

        public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
            return new Enumerator(this);
        }

        private Initialize(capacity: number): void {
            var size: number = HashHelpers.GetPrime(capacity);
            this.buckets = new Array(size);
            for (var i: number = 0; i < this.buckets.length; i++)
                this.buckets[i] = -1;
            this.entries = new Array(size);
            for (var i: number = 0; i < this.entries.length; i++)
                this.entries[i] = {};
            this.count = 0;
            this.version = 0;
            this.freeList = -1;
            this.freeCount = 0;
        }

        private Insert(key: TKey, value: TValue, add: boolean): void {
            if (key == null) {
                throw new ArgumentNullException('key');
            }
            if (this.buckets == null)
                this.Initialize(0);
            var hashCode: number = key.GetHashCode() & 0x7FFFFFFF;
            var targetBucket: number = hashCode % this.buckets.length;
            var comparer: IEqualityComparer<TKey> = this.keyComparer || DefaultDelegate.EqualityComparer;
            for (var i: number = this.buckets[targetBucket]; i >= 0; i = this.entries[i].next) {
                if (this.entries[i].hashCode == hashCode && comparer(this.entries[i].key, key)) {
                    if (add) {
                        throw new ArgumentException('duplicate key ' + key.toString());
                    }
                    this.entries[i].value = value;
                    this.version++;
                    return;
                }
            }
            var index: number;
            if (this.freeCount > 0) {
                index = this.freeList;
                this.freeList = this.entries[index].next;
                this.freeCount--;
            }
            else {
                if (this.count == this.entries.length) {
                    this.Resize();
                    targetBucket = hashCode % this.buckets.length;
                }
                index = this.count;
                this.count++;
            }
            this.entries[index].hashCode = hashCode;
            this.entries[index].next = this.buckets[targetBucket];
            this.entries[index].key = key;
            this.entries[index].value = value;
            this.buckets[targetBucket] = index;
            this.version++;
        }

        private Resize(): void {
            var newSize = HashHelpers.ExpandPrime(this.count);
            var newBuckets: number[] = new Array(newSize);
            for (var i: number = 0; i < newBuckets.length; i++)
                newBuckets[i] = -1;
            var newEntries = new Array(newSize);
            for (var i: number = 0; i < newEntries.length; i++)
                newEntries[i] = {};
            Arrays.Copy(this.entries, 0, newEntries, 0, this.count);
            for (var i: number = 0; i < this.count; i++) {
                if (newEntries[i].hashCode >= 0) {
                    var bucket: number = newEntries[i].hashCode % newSize;
                    newEntries[i].next = newBuckets[bucket];
                    newBuckets[bucket] = i;
                }
            }
            this.buckets = newBuckets;
            this.entries = newEntries;
        }

        public Remove(key: TKey): TValue {
            if (key == null) {
                throw new ArgumentNullException('key');
            }
            var comparer: IEqualityComparer<TKey> = this.keyComparer || DefaultDelegate.EqualityComparer;
            if (this.buckets != null) {
                var hashCode: number = key.GetHashCode() & 0x7FFFFFFF;
                var bucket: number = hashCode % this.buckets.length;
                var last: number = -1;
                for (var i: number = this.buckets[bucket]; i >= 0; last = i, i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && comparer(this.entries[i].key, key)) {
                        if (last < 0) {
                            this.buckets[bucket] = this.entries[i].next;
                        }
                        else {
                            this.entries[last].next = this.entries[i].next;
                        }
                        var rtn = this.entries[i].value;
                        this.entries[i].hashCode = -1;
                        this.entries[i].next = this.freeList;
                        this.entries[i].key = null;
                        this.entries[i].value = null;
                        this.freeList = i;
                        this.freeCount++;
                        this.version++;
                        return rtn;
                    }
                }
            }
            return null;
        }

        public TryGetValue(key: TKey, out: OutParam<TValue>): boolean {
            if (out == null)
                throw new ArgumentNullException('out parameter is null');
            var i: number = this.FindEntry(key);
            if (i >= 0) {
                out(this.entries[i].value);
                return true;
            }
            return false;
        }

    }

    class Enumerator<TKey extends Object, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>> {
        private hashTable: Dictionary<TKey, TValue>;
        private version: number;
        private index: number;
        private current: KeyValuePair<TKey, TValue>;

        constructor(hashTable: Dictionary<TKey, TValue>) {
            this.hashTable = hashTable;
            this.version = hashTable.Version;
            this.index = 0;
            this.current = null;
        }

        public MoveNext(): boolean {
            if (this.version != this.hashTable.Version) {
                throw new InvalidOperationException('version failed');
            }
            while (this.index < this.hashTable.Length) {
                if (this.hashTable.Entries[this.index].hashCode >= 0) {
                    this.current = {
                        Key: this.hashTable.Entries[this.index].key,
                        Value: this.hashTable.Entries[this.index].value
                    };
                    this.index++;
                    return true;
                }
                this.index++;
            }
            this.index = this.hashTable.Length + 1;
            this.current = null;
            return false;
        }

        public get Current(): KeyValuePair<TKey, TValue> {
            return this.current;
        }

        public Reset(): void {
            if (this.version != this.hashTable.Version) {
                throw new InvalidOperationException('version failed');
            }
            this.index = 0;
            this.current = null;
        }

        public Dispose(): void {

        }
    }
    abstract class HashHelpers {

        public static primes: number[] = [3, 7, 11, 17, 23, 29, 37, 47, 59, 71, 89, 107, 131, 163, 197, 239, 293, 353, 431, 521, 631, 761, 919,
            1103, 1327, 1597, 1931, 2333, 2801, 3371, 4049, 4861, 5839, 7013, 8419, 10103, 12143, 14591,
            17519, 21023, 25229, 30293, 36353, 43627, 52361, 62851, 75431, 90523, 108631, 130363, 156437,
            187751, 225307, 270371, 324449, 389357, 467237, 560689, 672827, 807403, 968897, 1162687, 1395263,
            1674319, 2009191, 2411033, 2893249, 3471899, 4166287, 4999559, 5999471, 7199369, 8639249, 10367101,
            12440537, 14928671, 17914409, 21497293, 25796759, 30956117, 37147349, 44576837, 53492207, 64190669,
            77028803, 92434613, 110921543, 133105859, 159727031, 191672443, 230006941, 276008387, 331210079,
            397452101, 476942527, 572331049, 686797261, 824156741, 988988137, 1186785773, 1424142949, 1708971541,
            2050765853, HashHelpers.MaxPrimeArrayLength];

        public static GetPrime(min: number): number {
            if (min < 0)
                throw new ArgumentException('min < 0');
            for (var i: number = 0; i < HashHelpers.primes.length; i++) {
                var prime: number = HashHelpers.primes[i];
                if (prime >= min)
                    return prime;
            }
            return min;
        }

        public static ExpandPrime(oldSize: number): number {
            var newSize: number = 2 * oldSize;
            if (newSize > HashHelpers.MaxPrimeArrayLength && HashHelpers.MaxPrimeArrayLength > oldSize) {
                return HashHelpers.MaxPrimeArrayLength;
            }
            return HashHelpers.GetPrime(newSize);
        }

        public static MaxPrimeArrayLength: number = 0x7FEFFFFD;
    }

}
