module DotnetJs.Collections {

    export class LinkedList<T> implements ICollection<T>
    {
        private head: LinkedListNode<T>;
        private count: number;
        private version: number;

        constructor(collection?: IEnumerable<T>) {
            this.count = 0;
            this.version = 0;
            if (collection == null) {
                return;
            }
            Linq.ForEach(collection, function (item) {
                this.AddLast(item);
            });
        }

        public get Count(): number {
            return this.count;
        }

        public get First(): LinkedListNode<T> {
            return this.head;
        }

        public get Last(): LinkedListNode<T> {
            return this.head == null ? null : this.head.prev;
        }

        public get Version(): number {
            return this.version;
        }

        public get IsReadOnly(): boolean {
            return false;
        }

        public Add(value: T): void {
            this.AddLast(value);
        }

        public AddAfter(node: LinkedListNode<T>, value: T): LinkedListNode<T> {
            this.ValidateNode(node);
            var result = new LinkedListNode<T>(node.list, value);
            this.InternalInsertNodeBefore(node.next, result);
            return result;
        }

        public AddBefore(node: LinkedListNode<T>, value: T): LinkedListNode<T> {
            this.ValidateNode(node);
            var result = new LinkedListNode<T>(node.list, value);
            this.InternalInsertNodeBefore(node, result);
            if (node == this.head) {
                this.head = result;
            }
            return result;
        }

        public AddFirst(value: T): LinkedListNode<T> {
            var result = new LinkedListNode<T>(this, value);
            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(result);
            }
            else {
                this.InternalInsertNodeBefore(this.head, result);
                this.head = result;
            }
            return result;
        }

        public AddLast(value: T): LinkedListNode<T> {
            var result = new LinkedListNode<T>(this, value);
            if (this.head == null) {
                this.InternalInsertNodeToEmptyList(result);
            }
            else {
                this.InternalInsertNodeBefore(this.head, result);
            }
            return result;
        }

        public Clear(): void {
            var current = this.head;
            while (current != null) {
                var temp = current;
                current = current.Next;
                temp.Invalidate();
            }
            this.head = null;
            this.count = 0;
            this.version++;
        }

        public Contains(value: T): boolean {
            return this.Find(value) != null;
        }

        public CopyTo(array: T[], index: number): void {
            if (array == null) {
                throw new ArgumentNullException('array');
            }
            if (index < 0) {
                throw new ArgumentOutOfRangeException('index < 0');
            }
            if (index > array.length) {
                throw new ArgumentOutOfRangeException('index > array.length');
            }
            if (array.length - index < this.Count) {
                throw new ArgumentException('insufficient space');
            }
            var node = this.head;
            if (node != null) {
                do {
                    array[index++] = node.item;
                    node = node.next;
                }
                while (node != this.head);
            }
        }

        public Find(value: T): LinkedListNode<T> {
            var node = this.head;
            var comparer = DefaultDelegate.EqualityComparer;
            if (node != null) {
                if (value != null) {
                    do {
                        if (comparer(node.item, value)) {
                            return node;
                        }
                        node = node.next;
                    }
                    while (node != this.head);
                }
                else {
                    do {
                        if (node.item == null) {
                            return node;
                        }
                        node = node.next;
                    }
                    while (node != this.head);
                }
            }
            return null;
        }

        public FindLast(value: T): LinkedListNode<T> {
            if (this.head == null)
                return null;
            var last = this.head.prev;
            var node = last;
            var comparer = DefaultDelegate.EqualityComparer;
            if (node != null) {
                if (value != null) {
                    do {
                        if (comparer(node.item, value)) {
                            return node;
                        }
                        node = node.prev;
                    }
                    while (node != last);
                }
                else {
                    do {
                        if (node.item == null) {
                            return node;
                        }
                        node = node.prev;
                    }
                    while (node != last);
                }
            }
            return null;
        }

        public GetEnumerator(): IEnumerator<T> {
            return new Enumerator(this);
        }

        public Remove(value: T): boolean {
            var node = this.Find(value);
            if (node != null) {
                this.InternalRemoveNode(node);
                return true;
            }
            return false;
        }

        public RemoveFirst(): void {
            if (this.head == null) {
                throw new InvalidOperationException('linked list is empty');
            }
            this.InternalRemoveNode(this.head);
        }

        public RemoveLast(): void {
            if (this.head == null) {
                throw new InvalidOperationException('linked list is empty');
            }
            this.InternalRemoveNode(this.head.prev);
        }

        private InternalInsertNodeBefore(node: LinkedListNode<T>, newNode: LinkedListNode<T>): void {
            newNode.next = node;
            newNode.prev = node.prev;
            node.prev.next = newNode;
            node.prev = newNode;
            this.version++;
            this.count++;
        }

        private InternalInsertNodeToEmptyList(newNode: LinkedListNode<T>): void {
            newNode.next = newNode;
            newNode.prev = newNode;
            this.head = newNode;
            this.version++;
            this.count++;
        }

        private InternalRemoveNode(node: LinkedListNode<T>): void {
            if (node.next == node) {
                this.head = null;
            }
            else {
                node.next.prev = node.prev;
                node.prev.next = node.next;
                if (this.head == node) {
                    this.head = node.next;
                }
            }
            node.Invalidate();
            this.count--;
            this.version++;
        }

        private ValidateNewNode(node: LinkedListNode<T>): void {
            if (node == null) {
                throw new ArgumentNullException('node');
            }
            if (node.list != null) {
                throw new InvalidOperationException('node has attached to another list');
            }
        }

        private ValidateNode(node: LinkedListNode<T>): void {
            if (node == null) {
                throw new ArgumentNullException('node');
            }
            if (node.list != this) {
                throw new InvalidOperationException('node linked to another list');
            }
        }

        get IsSynchronized(): boolean {
            return false;
        }
    }

    export class LinkedListNode<T>
    {
        public list: LinkedList<T>;
        public next: LinkedListNode<T>;
        public prev: LinkedListNode<T>;
        public item: T;

        constructor(list: LinkedList<T> = null, value: T) {
            this.list = list;
            this.item = value;
        }

        public get List(): LinkedList<T> {
            return this.list;
        }

        public get Next(): LinkedListNode<T> {
            return this.next == null || this.next == this.list.First ? null : this.next;
        }

        public get Previous(): LinkedListNode<T> {
            return this.prev == null || this == this.list.First ? null : this.prev;
        }

        public get Value(): T {
            return this.item;
        }

        public set Value(value: T) {
            this.item = value;
        }

        public Invalidate(): void {
            this.list = null;
            this.next = null;
            this.prev = null;
        }
    }

    class Enumerator<T> implements IEnumerator<T> {
        private _list: LinkedList<T>;
        private _node: LinkedListNode<T>;
        private _version: number;
        private _current: T;
        private _index: number;

        constructor(list: LinkedList<T>) {
            this._list = list;
            this._version = list.Version;
            this._node = list.First;
            this._current = null;
            this._index = 0;
        }

        public get Current(): T {
            return this._current;
        }

        public MoveNext(): boolean {
            if (this._version != this._list.Version) {
                throw new InvalidOperationException('version failed');
            }
            if (this._node == null) {
                this._index = this._list.Count + 1;
                return false;
            }
            ++this._index;
            this._current = this._node.item;
            this._node = this._node.next;
            if (this._node == this._list.First) {
                this._node = null;
            }
            return true;
        }

        public Reset(): void {
            if (this._version != this._list.Version) {
                throw new InvalidOperationException('version failed');
            }
            this._current = null;
            this._node = this._list.First;
            this._index = 0;
        }

        public Dispose(): void {

        }
    }
}