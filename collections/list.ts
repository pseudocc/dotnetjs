/// <reference path="../utils/array.ts" />
/// <reference path="../utils/errors.ts" />

module DotnetJs.Collections {

    export class List<T extends Object> implements ICollection<T>
    {
        private items: T[];
        private version: number;

        constructor(collection?: T[]) {
            this.items = collection || [];
            this.version = 0;
        }

        public get Count(): number {
            if (this.items.length < 0)
                throw new UnknownExeption();
            return this.items.length;
        }

        get IsReadOnly(): boolean {
            return false;
        }

        public get Values(): T[] {
            return this.items;
        }

        public GetValue(index: number): T {
            if (index < 0 || index > this.Count)
                throw new ArgumentOutOfRangeException('index: ' + index);
            return this.items[index];
        }

        public SetValue(index: number, value: T): void {
            if (index < 0 || index > this.items.length)
                throw new ArgumentOutOfRangeException('index: ' + index);
            this.items[index] = value;
        }

        public get Version(): number {
            return this.version;
        }

        public Add(item: T): void {
            this.items.push(item);
            this.version++;
        }

        public AddRange(collection: T[]): void {
            Arrays.AddRange(this.items, collection);
            this.version++;
        }

        public Clear(): void {
            if (this.Count > 0) {
                Arrays.Clear(this.items);
            }
            this.version++;
        }

        public Contains(item: T): boolean {
            return this.Count != 0 && this.IndexOf(item) != -1;
        }

        public CopyTo(array: any[], arrayIndex: number): void {
            if (array == null) {
                throw new ArgumentNullException('array');
            }
            try {
                Arrays.Copy(this.items, 0, array, arrayIndex, this.Count);
            }
            catch (err) {
                throw new ArgumentException('array');
            }
        }

        public Exists(match: (item: T) => boolean): boolean {
            return this.FindIndex(0, this.Count, match) != -1;
        }

        public Find(match: (item: T) => boolean): T {
            if (match == null) {
                throw new ArgumentNullException('match');
            }
            for (var i = 0; i < this.Count; i++) {
                if (match(this.items[i])) {
                    return this.items[i];
                }
            }
            return null;
        }

        public FindAll(match: (item: T) => boolean): List<T> {
            if (match == null) {
                throw new ArgumentNullException('match');
            }
            var list = new List<T>();
            for (var i = 0; i < this.Count; i++) {
                if (match(this.items[i])) {
                    list.Add(this.items[i]);
                }
            }
            return list;
        }

        public FindIndex(startIndex: number = 0, count: number = this.Count - startIndex, match: (item: T) => boolean): number {
            if (startIndex > this.Count) {
                throw new ArgumentOutOfRangeException('startIndex ' + startIndex);
            }
            if (count < 0 || startIndex > this.Count - count) {
                throw new ArgumentOutOfRangeException('count ' + count);
            }
            if (match == null) {
                throw new ArgumentNullException('match');
            }
            var endIndex = startIndex + count;
            for (var i = startIndex; i < endIndex; i++) {
                if (match(this.items[i])) {
                    if (i > -1 && i < startIndex + count)
                        return i;
                    throw new UnknownExeption();
                }
            }
            return -1;
        }

        public FindLastIndex(startIndex: number, count: number, match: (item: T) => boolean): number {
            if (match == null) {
                throw new ArgumentNullException('match');
            }
            if (this.Count == 0) {
                if (startIndex != -1) {
                    throw new ArgumentOutOfRangeException('startIndex ' + startIndex);
                }
            }
            else if (startIndex >= this.Count) {
                throw new ArgumentOutOfRangeException('startIndex ' + startIndex);
            }
            if (count < 0 || startIndex - count + 1 < 0) {
                throw new ArgumentOutOfRangeException('count ' + count);
            }
            var endIndex = startIndex - count;
            for (var i = startIndex; i > endIndex; i--) {
                if (match(this.items[i])) {
                    if (i > -1 && i > startIndex)
                        return i;
                    throw new UnknownExeption();
                }
            }
            return -1;
        }

        public ForEach(action: (item: T) => void): void {
            if (action == null) {
                throw new ArgumentNullException('action');
            }
            var version = this.version;
            for (var i = 0; i < this.Count; i++) {
                if (version != this.version) {
                    break;
                }
                action(this.items[i]);
            }
            if (version != this.version)
                throw new InvalidOperationException('version failed');
        }

        public GetEnumerator(): IEnumerator<T> {
            return new Enumerator(this);
        }

        public GetRange(index: number, count: number): List<T> {
            if (index < 0) {
                throw new ArgumentOutOfRangeException('index ' + index);
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException('count ' + count);
            }
            if (this.Count - index < count) {
                throw new ArgumentException('invalid offlen');
            }
            var list = new List<T>();
            Arrays.Copy(this.items, index, list.items, 0, count);
            return list;
        }

        public IndexOf(item: T): number {
            return Arrays.IndexOf(this.items, item, 0, this.Count);
        }

        public Remove(item: T): boolean {
            var index = this.IndexOf(item);
            if (index >= 0) {
                this.RemoveAt(index);
                return true;
            }
            return false;
        }

        public RemoveAll(match: (item: T) => boolean): number {
            if (match == null) {
                throw new ArgumentNullException('match');
            }

            var freeIndex = 0;
            while (freeIndex < this.Count && !match(this.items[freeIndex]))
                freeIndex++;
            if (freeIndex >= this.Count)
                return 0;
            var current = freeIndex + 1;
            while (current < this.Count) {
                while (current < this.Count && match(this.items[current]))
                    current++;
                if (current < this.Count) {
                    this.items[freeIndex++] = this.items[current++];
                }
            }
            Arrays.Clear(this.items, freeIndex, this.Count - freeIndex);
            var result = this.Count - freeIndex;
            this.version++;
            return result;
        }

        public RemoveAt(index: number): void {
            if (index >= this.Count) {
                throw new ArgumentOutOfRangeException('index');
            }
            if (index < this.Count) {
                Arrays.Copy(this.items, index + 1, this.items, index, this.Count - index);
            }
            this.items.length--;
            this.version++;
        }

        public RemoveLast(): T {
            var rtn = this.items.pop();
            this.version++;
            return rtn;
        }

        public RemoveRange(index: number, count: number): void {
            if (index < 0) {
                throw new ArgumentOutOfRangeException('index');
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException('count');
            }
            if (this.Count - index < count)
                throw new ArgumentException('invalid offset');
            if (count > 0) {
                if (index < this.Count) {
                    Arrays.Copy(this.items, index + count, this.items, index, this.Count - index);
                }
                Arrays.Clear(this.items, this.Count - count, count);
                this.version++;
            }
        }

        public Reverse(index: number, count: number): void {
            if (index < 0) {
                throw new ArgumentOutOfRangeException('index ' + index);
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException('count ' + count);
            }
            if (this.Count - index < count)
                throw new ArgumentException('invalid offset');
            var i = index;
            var j = index + count - 1;
            var array = this.items;
            while (i < j) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                i++;
                j--;
            }
            this.version++;
        }

        public Sort(index: number, count: number, comparison: (a: T, b: T) => number): void {
            if (index < 0) {
                throw new ArgumentOutOfRangeException('index ' + index);
            }
            if (count < 0) {
                throw new ArgumentOutOfRangeException('count ' + count);
            }
            if (this.Count - index < count)
                throw new ArgumentException('invalid offset');
            Arrays.Sort(this.items, index, count, comparison);
            this.version++;
        }

        public ToArray(): T[] {
            if (this.Count == 0) {
                return [];
            }
            var array: T[] = [];
            Arrays.Copy(this.items, 0, array, 0, this.Count);
            return array;
        }

    }

    class Enumerator<T> implements IEnumerator<T>
    {
        private list: List<T>;
        private index: number;
        private version: number;
        private current: T;

        constructor(list: List<T>) {
            this.list = list;
            this.index = 0;
            this.version = list.Version;
            this.current = null;
        }

        public MoveNext(): boolean {
            var localList: List<T> = this.list;
            if (this.version == localList.Version && (this.index < localList.Count)) {
                this.current = localList.GetValue(this.index);
                this.index++;
                return true;
            }
            return this.MoveNextRare();
        }

        private MoveNextRare(): boolean {
            if (this.version != this.list.Version) {
                throw new InvalidOperationException('version failed');
            }
            this.index = this.list.Count + 1;
            this.current = null;
            return false;
        }

        public get Current(): T {
            return this.current;
        }

        public Reset(): void {
            if (this.version != this.list.Version) {
                throw new InvalidOperationException('version failed');
            }
            this.index = 0;
            this.current = null;
        }

        public Dispose(): void {

        }

    }
}
