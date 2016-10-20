/// <reference path="../utils/objext.ts" />
/// <reference path="../utils/array.ts" />
/// <reference path="../utils/errors.ts" />
/// <reference path="./prim.ts" />

module DotnetJs.Collections {

    export class Dictionary<TKey extends Object, TValue> implements IDictionary<TKey, TValue> {

        private items: TValue[];
        private keys: TKey[];
        private version: number;
        private freeList: number[];

        constructor() {
            this.items = [];
            this.keys = [];
            this.freeList = [];
            this.version = 0;
        }

        public get Count() {
            return this.keys.length - this.freeList.length;
        }

        public get Keys(): TKey[] {
            var keys: TKey[] = [];
            if (this.Count == 0)
                return keys;
            for (var i = 0; i < this.keys.length; i++) {
                let key = this.keys[i];
                if (key && this.freeList.indexOf(i) == -1)
                    keys.push(key);
            }
            return keys;
        }

        public get KeyValuePairs(): KeyValuePair<TKey, TValue>[] {
            var pairs: KeyValuePair<TKey, TValue>[] = [];
            if (this.Count == 0)
                return pairs;
            for (var i = 0; i < this.keys.length; i++) {
                let key = this.keys[i];
                if (key && this.freeList.indexOf(i) == -1) {
                    let pair: KeyValuePair<TKey, TValue> = { Key: key, Value: this.items[i] };
                    pairs.push(pair);
                }
            }
            return pairs;
        }

        public get Values(): TValue[] {
            var values: TValue[] = [];
            if (this.Count == 0)
                return values;
            for (var i = 0; i < this.keys.length; i++) {
                let key = this.keys[i];
                if (key && this.freeList.indexOf(i) == -1)
                    values.push(this.items[i]);
            }
            return values;
        }

        public get Version(): number {
            return this.version;
        }

        public GetValue(key: TKey): TValue {
            if (key == null)
                throw new ArgumentNullException('key');
            var index = this.FindEntry(key);
            if (index == -1)
                throw new KeyNotFoundException(key.toString());
            return this.items[index];
        }

        public SetValue(key: TKey, value: TValue): void {
            if (key == null)
                throw new ArgumentNullException('key');
            var index = this.FindEntry(key);
            if (index == -1) {
                this.Add(key, value);
                return;
            }
            this.items[index] = value;
        }

        public Add(key: TKey, value: TValue): void {
            if (!key)
                throw new ArgumentNullException('key');
            if (this.FindEntry(key) != -1)
                throw new ArgumentException('duplicated key ' + key.toString());
            var index: number;
            if (this.freeList.length > 0) {
                index = this.freeList.pop();
            }
            else index = this.keys.length;
            this.keys[index] = key;
            this.items[index] = value;
            this.version++;
        }

        public Clear(): void {
            if (this.Count > 0) {
                Arrays.Clear(this.items);
                Arrays.Clear(this.keys);
                Arrays.Clear(this.freeList);
            }
            this.version++;
        }

        public Contains(keyValuePair: KeyValuePair<TKey, TValue>): boolean {
            var i = this.FindEntry(keyValuePair.Key);
            if (i >= 0 && this.items[i] === keyValuePair.Value) {
                return true;
            }
            return false;
        }

        public ContainsKey(key: TKey): boolean {
            return this.FindEntry(key) >= 0;
        }

        public ContainsValue(value: TValue): boolean {
            if (this.Count == 0)
                return false;
            var index = this.items.indexOf(value);
            if (index == -1)
                return false;
            if (this.freeList.indexOf(index) != -1)
                return false;

            return true;
        }

        private FindEntry(key: TKey): number {
            if (key == null) {
                throw new ArgumentNullException('key');
            }
            if (this.keys) {
                var index = this.keys.indexOf(key);
                if (this.freeList.indexOf(index) == -1)
                    return index;
            }
            return -1;
        }

        public ForEach(action: (item: KeyValuePair<TKey, TValue>) => void) {
            if (action == null) {
                throw new ArgumentNullException('action');
            }
            if (this.Count == 0)
                return;
            var version = this.version;
            for (var i = 0; i < this.keys.length; i++) {
                let key = this.keys[i];
                if (key && this.freeList.indexOf(i) == -1) {
                    let pair: KeyValuePair<TKey, TValue> = { Key: key, Value: this.items[i] };
                    action(pair);
                }
            }
            if (version != this.version)
                throw new InvalidOperationException('version failed');
        }

        public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
            return new Enumerator(this);
        }

        public Remove(key: TKey): TValue {
            var index = this.FindEntry(key)
            if (index == -1)
                throw new KeyNotFoundException(key.toString());
            var rtn = this.items[index];
            delete this.items[index];
            delete this.keys[index];
            this.freeList.push(index);
            return rtn;
        }

        public TryGetValue(key: TKey, out: OutParam<TValue>): boolean {
            if (out == null)
                throw new ArgumentNullException('out parameter is null');
            var i = this.FindEntry(key);
            if (i >= 0) {
                out.Value = this.items[i];
                return true;
            }
            delete out.Value;
            return false;
        }
    }

    class Enumerator<TKey, TValue> implements IEnumerator<KeyValuePair<TKey, TValue>> {

        private dictionary: Dictionary<TKey, TValue>;
        private pairs: KeyValuePair<TKey, TValue>[];
        private version: number;
        private enumerator: IEnumerator<KeyValuePair<TKey, TValue>>;

        constructor(dictionary: Dictionary<TKey, TValue>) {
            this.dictionary = dictionary;
            this.version = dictionary.Version;
            this.pairs = dictionary.KeyValuePairs;
            this.enumerator = this.pairs.GetEnumerator();
        }

        public MoveNext(): boolean {
            if (this.version != this.dictionary.Version) {
                throw new InvalidOperationException('version failed');
            }
            return this.enumerator.MoveNext();
        }

        public get Current(): KeyValuePair<TKey, TValue> {
            return this.enumerator.Current;
        }

        public Reset(): void {
            if (this.version != this.dictionary.Version) {
                throw new InvalidOperationException('version failed');
            }
            this.enumerator.Reset();
        }

        public Dispose(): void {
            this.enumerator.Dispose();
        }
    }

}
