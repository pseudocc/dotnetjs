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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Crc32Bit = (function () {
    function Crc32Bit() {
    }
    Crc32Bit.Init = function () {
        if (Crc32Bit._crcTbl != null)
            return;
        Crc32Bit._crcTbl = new Array(Crc32Bit.LENGTH);
        var c;
        for (var i = 0; i < Crc32Bit.LENGTH; i++) {
            c = i;
            for (var j = 0; j < 8; j++) {
                if ((c & 1) == 1) {
                    c = 0xEDB88320 ^ (c >> 1);
                }
                else {
                    c >>= 1;
                }
            }
            Crc32Bit._crcTbl[i] = c;
        }
    };
    Crc32Bit.ValueString = function (buf) {
        var elemAt = function (buf, index) {
            return buf.charCodeAt(index);
        };
        return Crc32Bit.Value(buf, 0, buf.length, elemAt);
    };
    Crc32Bit.Value = function (buf, offset, length, elemAt) {
        var c = 0xffffffff;
        if (Crc32Bit._crcTbl == null) {
            Crc32Bit.Init();
        }
        elemAt = elemAt || Crc32Bit._elemAt;
        for (var i = 0; i < length; i++) {
            var index = (c ^ elemAt(buf, i + offset)) & 0xff;
            c = Crc32Bit._crcTbl[index] ^ (c >> 8);
        }
        return ~c;
    };
    Crc32Bit._crcTbl = null;
    Crc32Bit.LENGTH = 256;
    Crc32Bit._elemAt = function (buf, index) { return buf[index]; };
    return Crc32Bit;
}());
(function () {
    Crc32Bit.Init();
    var id = 0;
    function StringHash(obj) {
        if (obj.IsValueType) {
            throw new DotnetJs.NotImplementedExeption('GetHashCode(boolean)');
        }
        var string = obj.toString();
        return Crc32Bit.ValueString(string);
    }
    Object.defineProperty(Object.prototype, 'IsValueType', {
        get: function () {
            var type = typeof this;
            return type == 'number'
                || type == 'boolean'
                || type == 'string'
                || this instanceof DotnetJs.ValueType;
        }
    });
    Object.prototype.GetHashCode = function (refresh) {
        if (this.hashCode && !refresh)
            return this.hashCode;
        var value = this.valueOf();
        var type = typeof value;
        switch (type) {
            case 'number':
                return value;
            case 'object':
                if (this.IsValueType) {
                    throw new DotnetJs.NotImplementedExeption('GetHashCode(boolean)');
                }
                break;
            default:
                return StringHash(value);
        }
        var newId = this.getTime == Date.prototype.getTime ? this.getTime() : id++;
        this.hashCode = newId;
        return newId;
    };
    Object.prototype.Equals = function (obj) {
        if (!obj.IsValueType)
            return obj === this;
        var vt = obj;
        return vt.GetHashCode() === this.GetHashCode();
    };
    Array.prototype.GetEnumerator = function () {
        return new ArrayEnumerator(this);
    };
})();
var ArrayEnumerator = (function () {
    function ArrayEnumerator(array) {
        this.array = array;
        this.index = 0;
        this.current = null;
    }
    ArrayEnumerator.prototype.MoveNext = function () {
        if (this.index >= this.array.length)
            return false;
        this.current = this.array[this.index++];
        return true;
    };
    Object.defineProperty(ArrayEnumerator.prototype, "Current", {
        get: function () {
            return this.current;
        },
        enumerable: true,
        configurable: true
    });
    ArrayEnumerator.prototype.Reset = function () {
        this.index = 0;
    };
    ArrayEnumerator.prototype.Dispose = function () {
    };
    return ArrayEnumerator;
}());
var DotnetJs;
(function (DotnetJs) {
    var Arrays;
    (function (Arrays) {
        function Copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            if (!sourceArray)
                throw new DotnetJs.ArgumentNullException('sourceArray');
            if (!destinationArray)
                throw new DotnetJs.ArgumentNullException('destinationArray');
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        }
        Arrays.Copy = Copy;
        function AddRange(array, collection, length) {
            if (!array)
                throw new DotnetJs.ArgumentNullException('array');
            if (!collection)
                throw new DotnetJs.ArgumentNullException('collection');
            if (!length)
                length = collection.length;
            for (var i = 0; i < length; i++) {
                array.push(collection[i]);
            }
        }
        Arrays.AddRange = AddRange;
        function Clear(array, freeIndex, length) {
            if (freeIndex === void 0) { freeIndex = 0; }
            if (!array)
                throw new DotnetJs.ArgumentNullException('array');
            var restIndex = length ? freeIndex + length : array.length;
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
        Arrays.Clear = Clear;
        function Sort(array, index, count, comparison) {
            if (!array)
                throw new DotnetJs.ArgumentNullException('array');
            index = index || 0;
            var end = count ? index + count : null;
            var subArr = array.slice(index, end);
            subArr.sort(comparison);
            for (var i = 0; i < subArr.length; i++) {
                array[index + i] = subArr[i];
            }
        }
        Arrays.Sort = Sort;
        function IndexOf(array, item, startIndex, length, comparer) {
            if (!array)
                throw new DotnetJs.ArgumentNullException('array');
            startIndex = startIndex || 0;
            length = length || (array.length - startIndex);
            comparer = comparer || DotnetJs.DefaultDelegate.EqualityComparer;
            for (var i = startIndex; i < length; i++) {
                if (comparer(array[i], item))
                    return i;
            }
            return -1;
        }
        Arrays.IndexOf = IndexOf;
        function LastIndexOf(array, item, startIndex, length, comparer) {
            if (!array)
                throw new DotnetJs.ArgumentNullException('array');
            startIndex = startIndex || 0;
            length = length || (array.length - startIndex);
            comparer = comparer || DotnetJs.DefaultDelegate.EqualityComparer;
            for (var i = startIndex + length - 1; i > startIndex; i--) {
                if (comparer(array[i], item))
                    return i;
            }
            return -1;
        }
        Arrays.LastIndexOf = LastIndexOf;
    })(Arrays = DotnetJs.Arrays || (DotnetJs.Arrays = {}));
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var NotImplementedExeption = (function (_super) {
        __extends(NotImplementedExeption, _super);
        function NotImplementedExeption(msg) {
            _super.call(this, 'NotImplementedExeption: ' + msg);
        }
        return NotImplementedExeption;
    }(Error));
    DotnetJs.NotImplementedExeption = NotImplementedExeption;
    var UnknownExeption = (function (_super) {
        __extends(UnknownExeption, _super);
        function UnknownExeption() {
            _super.call(this, 'UnknownExeption');
        }
        return UnknownExeption;
    }(Error));
    DotnetJs.UnknownExeption = UnknownExeption;
    var ArgumentException = (function (_super) {
        __extends(ArgumentException, _super);
        function ArgumentException(msg) {
            _super.call(this, 'ArgumentException: ' + msg);
        }
        return ArgumentException;
    }(Error));
    DotnetJs.ArgumentException = ArgumentException;
    var ArgumentNullException = (function (_super) {
        __extends(ArgumentNullException, _super);
        function ArgumentNullException(msg) {
            _super.call(this, 'ArgumentNullException: ' + msg);
        }
        return ArgumentNullException;
    }(Error));
    DotnetJs.ArgumentNullException = ArgumentNullException;
    var ArgumentOutOfRangeException = (function (_super) {
        __extends(ArgumentOutOfRangeException, _super);
        function ArgumentOutOfRangeException(msg) {
            _super.call(this, 'ArgumentOutOfRangeException: ' + msg);
        }
        return ArgumentOutOfRangeException;
    }(Error));
    DotnetJs.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
    var InvalidOperationException = (function (_super) {
        __extends(InvalidOperationException, _super);
        function InvalidOperationException(msg) {
            _super.call(this, 'InvalidOperationException: ' + msg);
        }
        return InvalidOperationException;
    }(Error));
    DotnetJs.InvalidOperationException = InvalidOperationException;
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var Collections;
    (function (Collections) {
        var LinkedList = (function () {
            function LinkedList(collection) {
                this.count = 0;
                this.version = 0;
                if (collection == null) {
                    return;
                }
                DotnetJs.Linq.ForEach(collection, function (item) {
                    this.AddLast(item);
                });
            }
            Object.defineProperty(LinkedList.prototype, "Count", {
                get: function () {
                    return this.count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "First", {
                get: function () {
                    return this.head;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "Last", {
                get: function () {
                    return this.head == null ? null : this.head.prev;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "Version", {
                get: function () {
                    return this.version;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedList.prototype, "IsReadOnly", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            LinkedList.prototype.Add = function (value) {
                this.AddLast(value);
            };
            LinkedList.prototype.AddAfter = function (node, value) {
                this.ValidateNode(node);
                var result = new LinkedListNode(node.list, value);
                this.InternalInsertNodeBefore(node.next, result);
                return result;
            };
            LinkedList.prototype.AddBefore = function (node, value) {
                this.ValidateNode(node);
                var result = new LinkedListNode(node.list, value);
                this.InternalInsertNodeBefore(node, result);
                if (node == this.head) {
                    this.head = result;
                }
                return result;
            };
            LinkedList.prototype.AddFirst = function (value) {
                var result = new LinkedListNode(this, value);
                if (this.head == null) {
                    this.InternalInsertNodeToEmptyList(result);
                }
                else {
                    this.InternalInsertNodeBefore(this.head, result);
                    this.head = result;
                }
                return result;
            };
            LinkedList.prototype.AddLast = function (value) {
                var result = new LinkedListNode(this, value);
                if (this.head == null) {
                    this.InternalInsertNodeToEmptyList(result);
                }
                else {
                    this.InternalInsertNodeBefore(this.head, result);
                }
                return result;
            };
            LinkedList.prototype.Clear = function () {
                var current = this.head;
                while (current != null) {
                    var temp = current;
                    current = current.Next;
                    temp.Invalidate();
                }
                this.head = null;
                this.count = 0;
                this.version++;
            };
            LinkedList.prototype.Contains = function (value) {
                return this.Find(value) != null;
            };
            LinkedList.prototype.CopyTo = function (array, index) {
                if (array == null) {
                    throw new DotnetJs.ArgumentNullException('array');
                }
                if (index < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index < 0');
                }
                if (index > array.length) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index > array.length');
                }
                if (array.length - index < this.Count) {
                    throw new DotnetJs.ArgumentException('insufficient space');
                }
                var node = this.head;
                if (node != null) {
                    do {
                        array[index++] = node.item;
                        node = node.next;
                    } while (node != this.head);
                }
            };
            LinkedList.prototype.Find = function (value) {
                var node = this.head;
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                if (node != null) {
                    if (value != null) {
                        do {
                            if (comparer(node.item, value)) {
                                return node;
                            }
                            node = node.next;
                        } while (node != this.head);
                    }
                    else {
                        do {
                            if (node.item == null) {
                                return node;
                            }
                            node = node.next;
                        } while (node != this.head);
                    }
                }
                return null;
            };
            LinkedList.prototype.FindLast = function (value) {
                if (this.head == null)
                    return null;
                var last = this.head.prev;
                var node = last;
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                if (node != null) {
                    if (value != null) {
                        do {
                            if (comparer(node.item, value)) {
                                return node;
                            }
                            node = node.prev;
                        } while (node != last);
                    }
                    else {
                        do {
                            if (node.item == null) {
                                return node;
                            }
                            node = node.prev;
                        } while (node != last);
                    }
                }
                return null;
            };
            LinkedList.prototype.GetEnumerator = function () {
                return new Enumerator(this);
            };
            LinkedList.prototype.Remove = function (value) {
                var node = this.Find(value);
                if (node != null) {
                    this.InternalRemoveNode(node);
                    return true;
                }
                return false;
            };
            LinkedList.prototype.RemoveFirst = function () {
                if (this.head == null) {
                    throw new DotnetJs.InvalidOperationException('linked list is empty');
                }
                this.InternalRemoveNode(this.head);
            };
            LinkedList.prototype.RemoveLast = function () {
                if (this.head == null) {
                    throw new DotnetJs.InvalidOperationException('linked list is empty');
                }
                this.InternalRemoveNode(this.head.prev);
            };
            LinkedList.prototype.InternalInsertNodeBefore = function (node, newNode) {
                newNode.next = node;
                newNode.prev = node.prev;
                node.prev.next = newNode;
                node.prev = newNode;
                this.version++;
                this.count++;
            };
            LinkedList.prototype.InternalInsertNodeToEmptyList = function (newNode) {
                newNode.next = newNode;
                newNode.prev = newNode;
                this.head = newNode;
                this.version++;
                this.count++;
            };
            LinkedList.prototype.InternalRemoveNode = function (node) {
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
            };
            LinkedList.prototype.ValidateNewNode = function (node) {
                if (node == null) {
                    throw new DotnetJs.ArgumentNullException('node');
                }
                if (node.list != null) {
                    throw new DotnetJs.InvalidOperationException('node has attached to another list');
                }
            };
            LinkedList.prototype.ValidateNode = function (node) {
                if (node == null) {
                    throw new DotnetJs.ArgumentNullException('node');
                }
                if (node.list != this) {
                    throw new DotnetJs.InvalidOperationException('node linked to another list');
                }
            };
            Object.defineProperty(LinkedList.prototype, "IsSynchronized", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            return LinkedList;
        }());
        Collections.LinkedList = LinkedList;
        var LinkedListNode = (function () {
            function LinkedListNode(list, value) {
                if (list === void 0) { list = null; }
                this.list = list;
                this.item = value;
            }
            Object.defineProperty(LinkedListNode.prototype, "List", {
                get: function () {
                    return this.list;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "Next", {
                get: function () {
                    return this.next == null || this.next == this.list.head ? null : this.next;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "Previous", {
                get: function () {
                    return this.prev == null || this == this.list.head ? null : this.prev;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LinkedListNode.prototype, "Value", {
                get: function () {
                    return this.item;
                },
                set: function (value) {
                    this.item = value;
                },
                enumerable: true,
                configurable: true
            });
            LinkedListNode.prototype.Invalidate = function () {
                this.list = null;
                this.next = null;
                this.prev = null;
            };
            return LinkedListNode;
        }());
        Collections.LinkedListNode = LinkedListNode;
        var Enumerator = (function () {
            function Enumerator(list) {
                this._list = list;
                this._version = list.Version;
                this._node = list.head;
                this._current = null;
                this._index = 0;
            }
            Object.defineProperty(Enumerator.prototype, "Current", {
                get: function () {
                    return this._current;
                },
                enumerable: true,
                configurable: true
            });
            Enumerator.prototype.MoveNext = function () {
                if (this._version != this._list.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
                }
                if (this._node == null) {
                    this._index = this._list.Count + 1;
                    return false;
                }
                ++this._index;
                this._current = this._node.item;
                this._node = this._node.next;
                if (this._node == this._list.head) {
                    this._node = null;
                }
                return true;
            };
            Enumerator.prototype.Reset = function () {
                if (this._version != this._list.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
                }
                this._current = null;
                this._node = this._list.head;
                this._index = 0;
            };
            Enumerator.prototype.Dispose = function () {
            };
            return Enumerator;
        }());
    })(Collections = DotnetJs.Collections || (DotnetJs.Collections = {}));
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var DefaultDelegate = (function () {
        function DefaultDelegate() {
        }
        DefaultDelegate.Predicate = function () { return true; };
        DefaultDelegate.Action = function () { };
        DefaultDelegate.Func = function () { return null; };
        DefaultDelegate.EmptyReturn = { value: 'Empty' };
        DefaultDelegate.EqualityComparer = function (a, b) { return a.Equals(b); };
        return DefaultDelegate;
    }());
    DotnetJs.DefaultDelegate = DefaultDelegate;
    function GetVersion() {
        var Major = 1;
        var Build = 4;
        var Revision = 0;
        return Major + '.' + Build + '.' + Revision;
    }
    function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
    }
    DotnetJs.Greetings = Greetings;
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var Collections;
    (function (Collections) {
        var KeyNotFoundException = (function (_super) {
            __extends(KeyNotFoundException, _super);
            function KeyNotFoundException(msg) {
                _super.call(this, 'KeyNotFoundException: ' + msg);
            }
            return KeyNotFoundException;
        }(Error));
        Collections.KeyNotFoundException = KeyNotFoundException;
    })(Collections = DotnetJs.Collections || (DotnetJs.Collections = {}));
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var Collections;
    (function (Collections) {
        var Dictionary = (function () {
            function Dictionary(capacity) {
                if (capacity === void 0) { capacity = 0; }
                if (capacity < 0)
                    throw new DotnetJs.ArgumentOutOfRangeException('capacity < 0');
                if (capacity > 0)
                    this.Initialize(capacity);
            }
            Object.defineProperty(Dictionary.prototype, "Count", {
                get: function () {
                    return this.count - this.freeCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Entries", {
                get: function () {
                    return this.entries;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Keys", {
                get: function () {
                    var keys = [];
                    if (this.Count == 0)
                        return keys;
                    for (var i = 0; i < this.count; i++) {
                        if (this.entries[i].hashCode < 0)
                            return;
                        keys.push(this.entries[i].key);
                    }
                    return keys;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "KeyValuePairs", {
                get: function () {
                    var pairs = [];
                    if (this.Count == 0)
                        return pairs;
                    for (var i = 0; i < this.count; i++) {
                        var pair = { Key: this.entries[i].key, Value: this.entries[i].value };
                        pairs.push(pair);
                    }
                    return pairs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Length", {
                get: function () {
                    return this.count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Values", {
                get: function () {
                    var values = [];
                    if (this.Count == 0)
                        return values;
                    for (var i = 0; i < this.count; i++) {
                        if (this.entries[i].hashCode < 0)
                            return;
                        values.push(this.entries[i].value);
                    }
                    return values;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Dictionary.prototype, "Version", {
                get: function () {
                    return this.version;
                },
                enumerable: true,
                configurable: true
            });
            Dictionary.prototype.GetValue = function (key) {
                var i = this.FindEntry(key);
                if (i >= 0)
                    return this.entries[i].value;
                throw new Collections.KeyNotFoundException(key.toString());
            };
            Dictionary.prototype.SetValue = function (key, value) {
                this.Insert(key, value, false);
            };
            Dictionary.prototype.Add = function (key, value) {
                this.Insert(key, value, true);
            };
            Dictionary.prototype.Clear = function () {
                if (this.count > 0) {
                    for (var i = 0; i < this.buckets.length; i++)
                        this.buckets[i] = -1;
                    DotnetJs.Arrays.Clear(this.entries, 0, this.count);
                    this.freeList = -1;
                    this.count = 0;
                    this.freeCount = 0;
                    this.version++;
                }
            };
            Dictionary.prototype.Contains = function (keyValuePair) {
                var i = this.FindEntry(keyValuePair.Key);
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                if (i >= 0 && comparer(this.entries[i].value, keyValuePair.Value)) {
                    return true;
                }
                return false;
            };
            Dictionary.prototype.ContainsKey = function (key) {
                return this.FindEntry(key) >= 0;
            };
            Dictionary.prototype.ContainsValue = function (value) {
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
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
            };
            Dictionary.prototype.FindEntry = function (key) {
                if (key == null) {
                    throw new DotnetJs.ArgumentNullException(key.toString());
                }
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                if (this.buckets != null) {
                    var hashCode = key.GetHashCode() & 0x7FFFFFFF;
                    for (var i = this.buckets[hashCode % this.buckets.length]; i >= 0; i = this.entries[i].next) {
                        if (this.entries[i].hashCode == hashCode && comparer(this.entries[i].key, key))
                            return i;
                    }
                }
                return -1;
            };
            Dictionary.prototype.ForEach = function (action) {
                if (action == null) {
                    throw new DotnetJs.ArgumentNullException('action');
                }
                if (this.Count == 0)
                    return;
                var version = this.version;
                for (var i = 0; i < this.count; i++) {
                    var pair = { Key: this.entries[i].key, Value: this.entries[i].value };
                    action(pair);
                }
                if (version != this.version)
                    throw new DotnetJs.InvalidOperationException('version failed');
            };
            Dictionary.prototype.GetEnumerator = function () {
                return new Enumerator(this);
            };
            Dictionary.prototype.Initialize = function (capacity) {
                var size = HashHelpers.GetPrime(capacity);
                this.buckets = new Array(size);
                for (var i = 0; i < this.buckets.length; i++)
                    this.buckets[i] = -1;
                this.entries = new Array(size);
                for (var i = 0; i < this.entries.length; i++)
                    this.entries[i] = {};
                this.count = 0;
                this.version = 0;
                this.freeList = -1;
                this.freeCount = 0;
            };
            Dictionary.prototype.Insert = function (key, value, add) {
                if (key == null) {
                    throw new DotnetJs.ArgumentNullException('key');
                }
                if (this.buckets == null)
                    this.Initialize(0);
                var hashCode = key.GetHashCode() & 0x7FFFFFFF;
                var targetBucket = hashCode % this.buckets.length;
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                for (var i = this.buckets[targetBucket]; i >= 0; i = this.entries[i].next) {
                    if (this.entries[i].hashCode == hashCode && comparer(this.entries[i].key, key)) {
                        if (add) {
                            throw new DotnetJs.ArgumentException('duplicate key ' + key.toString());
                        }
                        this.entries[i].value = value;
                        this.version++;
                        return;
                    }
                }
                var index;
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
            };
            Dictionary.prototype.Resize = function () {
                var newSize = HashHelpers.ExpandPrime(this.count);
                var newBuckets = new Array(newSize);
                for (var i = 0; i < newBuckets.length; i++)
                    newBuckets[i] = -1;
                var newEntries = new Array(newSize);
                for (var i = 0; i < newEntries.length; i++)
                    newEntries[i] = {};
                DotnetJs.Arrays.Copy(this.entries, 0, newEntries, 0, this.count);
                for (var i = 0; i < this.count; i++) {
                    if (newEntries[i].hashCode >= 0) {
                        var bucket = newEntries[i].hashCode % newSize;
                        newEntries[i].next = newBuckets[bucket];
                        newBuckets[bucket] = i;
                    }
                }
                this.buckets = newBuckets;
                this.entries = newEntries;
            };
            Dictionary.prototype.Remove = function (key) {
                if (key == null) {
                    throw new DotnetJs.ArgumentNullException('key');
                }
                var comparer = DotnetJs.DefaultDelegate.EqualityComparer;
                if (this.buckets != null) {
                    var hashCode = key.GetHashCode() & 0x7FFFFFFF;
                    var bucket = hashCode % this.buckets.length;
                    var last = -1;
                    for (var i = this.buckets[bucket]; i >= 0; last = i, i = this.entries[i].next) {
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
            };
            Dictionary.prototype.TryGetValue = function (key, out) {
                if (out == null)
                    throw new DotnetJs.ArgumentNullException('out parameter is null');
                var i = this.FindEntry(key);
                if (i >= 0) {
                    out.Value = this.entries[i].value;
                    return true;
                }
                delete out.Value;
                return false;
            };
            return Dictionary;
        }());
        Collections.Dictionary = Dictionary;
        var Enumerator = (function () {
            function Enumerator(hashTable) {
                this.hashTable = hashTable;
                this.version = hashTable.Version;
                this.index = 0;
                this.current = null;
            }
            Enumerator.prototype.MoveNext = function () {
                if (this.version != this.hashTable.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
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
            };
            Object.defineProperty(Enumerator.prototype, "Current", {
                get: function () {
                    return this.current;
                },
                enumerable: true,
                configurable: true
            });
            Enumerator.prototype.Reset = function () {
                if (this.version != this.hashTable.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
                }
                this.index = 0;
                this.current = null;
            };
            Enumerator.prototype.Dispose = function () {
            };
            return Enumerator;
        }());
        Collections.Enumerator = Enumerator;
        var HashHelpers = (function () {
            function HashHelpers() {
            }
            HashHelpers.GetPrime = function (min) {
                if (min < 0)
                    throw new DotnetJs.ArgumentException('min < 0');
                for (var i = 0; i < HashHelpers.primes.length; i++) {
                    var prime = HashHelpers.primes[i];
                    if (prime >= min)
                        return prime;
                }
                return min;
            };
            HashHelpers.ExpandPrime = function (oldSize) {
                var newSize = 2 * oldSize;
                if (newSize > HashHelpers.MaxPrimeArrayLength && HashHelpers.MaxPrimeArrayLength > oldSize) {
                    return HashHelpers.MaxPrimeArrayLength;
                }
                return HashHelpers.GetPrime(newSize);
            };
            HashHelpers.primes = [3, 7, 11, 17, 23, 29, 37, 47, 59, 71, 89, 107, 131, 163, 197, 239, 293, 353, 431, 521, 631, 761, 919,
                1103, 1327, 1597, 1931, 2333, 2801, 3371, 4049, 4861, 5839, 7013, 8419, 10103, 12143, 14591,
                17519, 21023, 25229, 30293, 36353, 43627, 52361, 62851, 75431, 90523, 108631, 130363, 156437,
                187751, 225307, 270371, 324449, 389357, 467237, 560689, 672827, 807403, 968897, 1162687, 1395263,
                1674319, 2009191, 2411033, 2893249, 3471899, 4166287, 4999559, 5999471, 7199369, 8639249, 10367101,
                12440537, 14928671, 17914409, 21497293, 25796759, 30956117, 37147349, 44576837, 53492207, 64190669,
                77028803, 92434613, 110921543, 133105859, 159727031, 191672443, 230006941, 276008387, 331210079,
                397452101, 476942527, 572331049, 686797261, 824156741, 988988137, 1186785773, 1424142949, 1708971541,
                2050765853, HashHelpers.MaxPrimeArrayLength];
            HashHelpers.MaxPrimeArrayLength = 0x7FEFFFFD;
            return HashHelpers;
        }());
    })(Collections = DotnetJs.Collections || (DotnetJs.Collections = {}));
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var Linq;
    (function (Linq) {
        function LinqStart(source) {
            return new LinqIntermediate(source, function (item) { return item; });
        }
        Linq.LinqStart = LinqStart;
        var LinqIntermediate = (function () {
            function LinqIntermediate(source, func) {
                this.source = source;
                this.toResult = func;
            }
            LinqIntermediate.prototype.GetEnumerator = function () {
                return new LinqEnumerator(this.source, this.toResult);
            };
            LinqIntermediate.prototype.Aggregate = function (seed, func) {
                return Linq.Aggregate(this, seed, func);
            };
            LinqIntermediate.prototype.Average = function () {
                return Linq.Average(this);
            };
            LinqIntermediate.prototype.All = function (predicate) {
                return Linq.All(this, predicate);
            };
            LinqIntermediate.prototype.Any = function (predicate) {
                return Linq.Any(this, predicate);
            };
            LinqIntermediate.prototype.Concat = function (enumerable) {
                return Linq.Concat(this, enumerable);
            };
            LinqIntermediate.prototype.Contains = function (element, comparer) {
                return Linq.Contains(this, element, comparer);
            };
            LinqIntermediate.prototype.Count = function (predicate) {
                return Linq.Count(this, predicate);
            };
            LinqIntermediate.prototype.ElementAt = function (index) {
                return Linq.ElementAt(this, index);
            };
            LinqIntermediate.prototype.Except = function (enumerable, comparer) {
                return Linq.Except(this, enumerable, comparer);
            };
            LinqIntermediate.prototype.First = function (predicate) {
                return Linq.First(this, predicate);
            };
            LinqIntermediate.prototype.ForEach = function (action) {
                Linq.ForEach(this, action);
            };
            LinqIntermediate.prototype.IndexOf = function (element) {
                return Linq.IndexOf(this, element);
            };
            LinqIntermediate.prototype.Intersect = function (enumerable, comparer) {
                return Linq.Intersect(this, enumerable, comparer);
            };
            LinqIntermediate.prototype.LastIndexOf = function (element) {
                return Linq.LastIndexOf(this, element);
            };
            LinqIntermediate.prototype.Max = function (comparer) {
                return Linq.Max(this, comparer);
            };
            LinqIntermediate.prototype.Min = function (comparer) {
                return Linq.Min(this, comparer);
            };
            LinqIntermediate.prototype.Select = function (func) {
                return Linq.Select(this, func);
            };
            LinqIntermediate.prototype.Where = function (predicate) {
                return Linq.Where(this, predicate);
            };
            LinqIntermediate.prototype.ToArray = function () {
                return Linq.ToArray(this);
            };
            LinqIntermediate.prototype.ToList = function () {
                return Linq.ToList(this);
            };
            return LinqIntermediate;
        }());
        Linq.LinqIntermediate = LinqIntermediate;
        var LinqEnumerator = (function () {
            function LinqEnumerator(source, toResult) {
                this.enumerator = source.GetEnumerator();
                this.toResult = toResult;
            }
            LinqEnumerator.prototype.MoveNext = function () {
                var next = this.enumerator.MoveNext();
                while (next && this.Current === DotnetJs.DefaultDelegate.EmptyReturn) {
                    next = this.enumerator.MoveNext();
                }
                return next;
            };
            Object.defineProperty(LinqEnumerator.prototype, "Current", {
                get: function () {
                    return this.toResult(this.enumerator.Current);
                },
                enumerable: true,
                configurable: true
            });
            LinqEnumerator.prototype.Reset = function () {
                this.enumerator.Reset();
            };
            LinqEnumerator.prototype.Dispose = function () {
                this.enumerator.Dispose();
            };
            return LinqEnumerator;
        }());
        function Aggregate(source, seed, func) {
            if (seed == null)
                throw new DotnetJs.ArgumentNullException('seed');
            if (func == null)
                throw new DotnetJs.ArgumentNullException('func');
            ForEach(source, function (item) {
                seed = func(seed, item);
            });
            return seed;
        }
        Linq.Aggregate = Aggregate;
        function Average(source) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            var result = 0;
            var length = 0;
            var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext()) {
                if (typeof enumerator.Current != 'number')
                    throw new DotnetJs.ArgumentException('not a number');
                length++;
                result += enumerator.Current;
            }
            return result / length;
        }
        Linq.Average = Average;
        function All(source, predicate) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            if (predicate == null)
                throw new DotnetJs.ArgumentNullException('predicate');
            var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext()) {
                if (predicate(enumerator.Current)) {
                    continue;
                }
                return false;
            }
            return true;
        }
        Linq.All = All;
        function Any(source, predicate) {
            return Linq.Count(source, predicate) === 0;
        }
        Linq.Any = Any;
        function Concat(first, second) {
            if (first == null)
                throw new DotnetJs.ArgumentNullException('first');
            if (second == null)
                throw new DotnetJs.ArgumentNullException('second');
            var result = [];
            var enumerators = [first.GetEnumerator(), second.GetEnumerator()];
            for (var i = 0; i < 2; i++)
                while (enumerators[i].MoveNext()) {
                    result.push(enumerators[i].Current);
                }
            var linq = new LinqIntermediate(result, function (item) { return item; });
            return linq;
        }
        Linq.Concat = Concat;
        function Contains(source, element, comparer) {
            if (element == null)
                throw new DotnetJs.ArgumentNullException('element');
            comparer = comparer || DotnetJs.DefaultDelegate.EqualityComparer;
            return Linq.Any(source, function (item) { return comparer(item, element); });
        }
        Linq.Contains = Contains;
        function Count(source, predicate) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            predicate = predicate || DotnetJs.DefaultDelegate.Predicate;
            var enumerator = source.GetEnumerator();
            var count = 0;
            while (enumerator.MoveNext()) {
                if (predicate(enumerator.Current)) {
                    count++;
                }
            }
            return count;
        }
        Linq.Count = Count;
        function ElementAt(source, index) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            if (index < 0)
                throw new DotnetJs.ArgumentOutOfRangeException('index: ' + index);
            var enumerator = source.GetEnumerator();
            for (var i = 0; i <= index; i++) {
                if (!enumerator.MoveNext())
                    throw new DotnetJs.ArgumentOutOfRangeException('index: ' + index);
            }
            return enumerator.Current;
        }
        Linq.ElementAt = ElementAt;
        function Except(first, second, comparer) {
            if (first == null)
                throw new DotnetJs.ArgumentNullException('first');
            if (second == null)
                throw new DotnetJs.ArgumentNullException('second');
            var result = [];
            var enumerator = first.GetEnumerator();
            while (enumerator.MoveNext()) {
                if (!Linq.Contains(second, enumerator.Current, comparer))
                    result.push(enumerator.Current);
            }
            var linq = new LinqIntermediate(result, function (item) { return item; });
            return linq;
        }
        Linq.Except = Except;
        function First(source, predicate) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            predicate = predicate || DotnetJs.DefaultDelegate.Predicate;
            var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext()) {
                var current = enumerator.Current;
                if (predicate(current)) {
                    return current;
                }
            }
            return null;
        }
        Linq.First = First;
        function ForEach(source, action) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            if (action == null)
                throw new DotnetJs.ArgumentNullException('action');
            var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext()) {
                action(enumerator.Current);
            }
        }
        Linq.ForEach = ForEach;
        function IndexOf(source, element) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            var enumerator = source.GetEnumerator();
            var index = 0;
            while (enumerator.MoveNext()) {
                if (element === enumerator.Current)
                    return index;
                index++;
            }
            return -1;
        }
        Linq.IndexOf = IndexOf;
        function Intersect(first, second, comparer) {
            if (first == null)
                throw new DotnetJs.ArgumentNullException('first');
            if (second == null)
                throw new DotnetJs.ArgumentNullException('second');
            var result = [];
            var enumerator = first.GetEnumerator();
            while (enumerator.MoveNext()) {
                if (Linq.Contains(second, enumerator.Current, comparer))
                    result.push(enumerator.Current);
            }
            var linq = new LinqIntermediate(result, function (item) { return item; });
            return linq;
        }
        Linq.Intersect = Intersect;
        function LastIndexOf(source, element) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            var enumerator = source.GetEnumerator();
            var index = 0;
            var rtn = -1;
            while (enumerator.MoveNext()) {
                if (element === enumerator.Current)
                    rtn = index;
                index++;
            }
            return rtn;
        }
        Linq.LastIndexOf = LastIndexOf;
        function Max(source, comparer) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            comparer = comparer || (function (a, b) {
                if (a === b)
                    return 0;
                if (a > b)
                    return 1;
                if (a < b)
                    return -1;
                return 0;
            });
            var max = null;
            var enumerator = source.GetEnumerator();
            while (enumerator.MoveNext()) {
                var current = enumerator.Current;
                if (comparer(max, current) > 0 && current != null)
                    max = current;
            }
            return max;
        }
        Linq.Max = Max;
        function Min(source, comparer) {
            var reverseComparer = comparer || (function (a, b) {
                if (a === b)
                    return 0;
                if (a > b)
                    return -1;
                if (a < b)
                    return 1;
                return 0;
            });
            return Linq.Max(source, reverseComparer);
        }
        Linq.Min = Min;
        function Range(start, count) {
            if (start == null)
                throw new DotnetJs.ArgumentNullException('start');
            if (count == null)
                throw new DotnetJs.ArgumentNullException('count');
            var result = [];
            for (var i = start; i < start + count; i++) {
                result.push(i);
            }
            var linq = new LinqIntermediate(result, function (item) { return item; });
            return linq;
        }
        Linq.Range = Range;
        function Repeat(element, count) {
            if (count == null)
                throw new DotnetJs.ArgumentNullException('count');
            var result = [];
            for (var i = 0; i < count; i++) {
                result.push(element);
            }
            var linq = new LinqIntermediate(result, function (item) { return item; });
            return linq;
        }
        Linq.Repeat = Repeat;
        function Select(source, func) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            if (func == null)
                throw new DotnetJs.ArgumentNullException('func');
            var linq = new LinqIntermediate(source, func);
            return linq;
        }
        Linq.Select = Select;
        function ToArray(source) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            var enumerator = source.GetEnumerator();
            var result = [];
            while (enumerator.MoveNext()) {
                result.push(enumerator.Current);
            }
            return result;
        }
        Linq.ToArray = ToArray;
        function ToList(source) {
            return new DotnetJs.Collections.List(ToArray(source));
        }
        Linq.ToList = ToList;
        function Where(source, predicate) {
            if (source == null)
                throw new DotnetJs.ArgumentNullException('source');
            if (predicate == null)
                throw new DotnetJs.ArgumentNullException('predicate');
            var func = function (item) {
                if (predicate(item))
                    return item;
                return DotnetJs.DefaultDelegate.EmptyReturn;
            };
            var linq = new LinqIntermediate(source, func);
            return linq;
        }
        Linq.Where = Where;
    })(Linq = DotnetJs.Linq || (DotnetJs.Linq = {}));
})(DotnetJs || (DotnetJs = {}));
var DotnetJs;
(function (DotnetJs) {
    var Collections;
    (function (Collections) {
        var List = (function () {
            function List(collection) {
                this.items = collection || [];
                this.version = 0;
            }
            Object.defineProperty(List.prototype, "Count", {
                get: function () {
                    if (this.items.length < 0)
                        throw new DotnetJs.UnknownExeption();
                    return this.items.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(List.prototype, "IsReadOnly", {
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(List.prototype, "Values", {
                get: function () {
                    return this.items;
                },
                enumerable: true,
                configurable: true
            });
            List.prototype.GetValue = function (index) {
                if (index < 0 || index > this.Count)
                    throw new DotnetJs.ArgumentOutOfRangeException('index: ' + index);
                return this.items[index];
            };
            List.prototype.SetValue = function (index, value) {
                if (index < 0 || index > this.items.length)
                    throw new DotnetJs.ArgumentOutOfRangeException('index: ' + index);
                this.items[index] = value;
            };
            Object.defineProperty(List.prototype, "Version", {
                get: function () {
                    return this.version;
                },
                enumerable: true,
                configurable: true
            });
            List.prototype.Add = function (item) {
                this.items.push(item);
                this.version++;
            };
            List.prototype.AddRange = function (collection) {
                DotnetJs.Arrays.AddRange(this.items, collection);
                this.version++;
            };
            List.prototype.Clear = function () {
                if (this.Count > 0) {
                    DotnetJs.Arrays.Clear(this.items);
                }
                this.version++;
            };
            List.prototype.Contains = function (item) {
                return this.Count != 0 && this.IndexOf(item) != -1;
            };
            List.prototype.CopyTo = function (array, arrayIndex) {
                if (array == null) {
                    throw new DotnetJs.ArgumentNullException('array');
                }
                try {
                    DotnetJs.Arrays.Copy(this.items, 0, array, arrayIndex, this.Count);
                }
                catch (err) {
                    throw new DotnetJs.ArgumentException('array');
                }
            };
            List.prototype.Exists = function (match) {
                return this.FindIndex(0, this.Count, match) != -1;
            };
            List.prototype.Find = function (match) {
                if (match == null) {
                    throw new DotnetJs.ArgumentNullException('match');
                }
                for (var i = 0; i < this.Count; i++) {
                    if (match(this.items[i])) {
                        return this.items[i];
                    }
                }
                return null;
            };
            List.prototype.FindAll = function (match) {
                if (match == null) {
                    throw new DotnetJs.ArgumentNullException('match');
                }
                var list = new List();
                for (var i = 0; i < this.Count; i++) {
                    if (match(this.items[i])) {
                        list.Add(this.items[i]);
                    }
                }
                return list;
            };
            List.prototype.FindIndex = function (startIndex, count, match) {
                if (startIndex === void 0) { startIndex = 0; }
                if (count === void 0) { count = this.Count - startIndex; }
                if (startIndex > this.Count) {
                    throw new DotnetJs.ArgumentOutOfRangeException('startIndex ' + startIndex);
                }
                if (count < 0 || startIndex > this.Count - count) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count ' + count);
                }
                if (match == null) {
                    throw new DotnetJs.ArgumentNullException('match');
                }
                var endIndex = startIndex + count;
                for (var i = startIndex; i < endIndex; i++) {
                    if (match(this.items[i])) {
                        if (i > -1 && i < startIndex + count)
                            return i;
                        throw new DotnetJs.UnknownExeption();
                    }
                }
                return -1;
            };
            List.prototype.FindLastIndex = function (startIndex, count, match) {
                if (match == null) {
                    throw new DotnetJs.ArgumentNullException('match');
                }
                if (this.Count == 0) {
                    if (startIndex != -1) {
                        throw new DotnetJs.ArgumentOutOfRangeException('startIndex ' + startIndex);
                    }
                }
                else if (startIndex >= this.Count) {
                    throw new DotnetJs.ArgumentOutOfRangeException('startIndex ' + startIndex);
                }
                if (count < 0 || startIndex - count + 1 < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count ' + count);
                }
                var endIndex = startIndex - count;
                for (var i = startIndex; i > endIndex; i--) {
                    if (match(this.items[i])) {
                        if (i > -1 && i > startIndex)
                            return i;
                        throw new DotnetJs.UnknownExeption();
                    }
                }
                return -1;
            };
            List.prototype.ForEach = function (action) {
                if (action == null) {
                    throw new DotnetJs.ArgumentNullException('action');
                }
                var version = this.version;
                for (var i = 0; i < this.Count; i++) {
                    if (version != this.version) {
                        break;
                    }
                    action(this.items[i]);
                }
                if (version != this.version)
                    throw new DotnetJs.InvalidOperationException('version failed');
            };
            List.prototype.GetEnumerator = function () {
                return new Enumerator(this);
            };
            List.prototype.GetRange = function (index, count) {
                if (index < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index ' + index);
                }
                if (count < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count ' + count);
                }
                if (this.Count - index < count) {
                    throw new DotnetJs.ArgumentException('invalid offlen');
                }
                var list = new List();
                DotnetJs.Arrays.Copy(this.items, index, list.items, 0, count);
                return list;
            };
            List.prototype.IndexOf = function (item) {
                return DotnetJs.Arrays.IndexOf(this.items, item, 0, this.Count);
            };
            List.prototype.Remove = function (item) {
                var index = this.IndexOf(item);
                if (index >= 0) {
                    this.RemoveAt(index);
                    return true;
                }
                return false;
            };
            List.prototype.RemoveAll = function (match) {
                if (match == null) {
                    throw new DotnetJs.ArgumentNullException('match');
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
                DotnetJs.Arrays.Clear(this.items, freeIndex, this.Count - freeIndex);
                var result = this.Count - freeIndex;
                this.version++;
                return result;
            };
            List.prototype.RemoveAt = function (index) {
                if (index >= this.Count) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index');
                }
                if (index < this.Count) {
                    DotnetJs.Arrays.Copy(this.items, index + 1, this.items, index, this.Count - index);
                }
                this.items.length--;
                this.version++;
            };
            List.prototype.RemoveLast = function () {
                var rtn = this.items.pop();
                this.version++;
                return rtn;
            };
            List.prototype.RemoveRange = function (index, count) {
                if (index < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index');
                }
                if (count < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count');
                }
                if (this.Count - index < count)
                    throw new DotnetJs.ArgumentException('invalid offset');
                if (count > 0) {
                    if (index < this.Count) {
                        DotnetJs.Arrays.Copy(this.items, index + count, this.items, index, this.Count - index);
                    }
                    DotnetJs.Arrays.Clear(this.items, this.Count - count, count);
                    this.version++;
                }
            };
            List.prototype.Reverse = function (index, count) {
                if (index < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index ' + index);
                }
                if (count < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count ' + count);
                }
                if (this.Count - index < count)
                    throw new DotnetJs.ArgumentException('invalid offset');
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
            };
            List.prototype.Sort = function (index, count, comparison) {
                if (index < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('index ' + index);
                }
                if (count < 0) {
                    throw new DotnetJs.ArgumentOutOfRangeException('count ' + count);
                }
                if (this.Count - index < count)
                    throw new DotnetJs.ArgumentException('invalid offset');
                DotnetJs.Arrays.Sort(this.items, index, count, comparison);
                this.version++;
            };
            List.prototype.ToArray = function () {
                if (this.Count == 0) {
                    return [];
                }
                var array = [];
                DotnetJs.Arrays.Copy(this.items, 0, array, 0, this.Count);
                return array;
            };
            return List;
        }());
        Collections.List = List;
        var Enumerator = (function () {
            function Enumerator(list) {
                this.list = list;
                this.index = 0;
                this.version = list.Version;
                this.current = null;
            }
            Enumerator.prototype.MoveNext = function () {
                var localList = this.list;
                if (this.version == localList.Version && (this.index < localList.Count)) {
                    this.current = localList.GetValue(this.index);
                    this.index++;
                    return true;
                }
                return this.MoveNextRare();
            };
            Enumerator.prototype.MoveNextRare = function () {
                if (this.version != this.list.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
                }
                this.index = this.list.Count + 1;
                this.current = null;
                return false;
            };
            Object.defineProperty(Enumerator.prototype, "Current", {
                get: function () {
                    return this.current;
                },
                enumerable: true,
                configurable: true
            });
            Enumerator.prototype.Reset = function () {
                if (this.version != this.list.Version) {
                    throw new DotnetJs.InvalidOperationException('version failed');
                }
                this.index = 0;
                this.current = null;
            };
            Enumerator.prototype.Dispose = function () {
            };
            return Enumerator;
        }());
    })(Collections = DotnetJs.Collections || (DotnetJs.Collections = {}));
})(DotnetJs || (DotnetJs = {}));
try {
    module.exports = DotnetJs;
}
catch (e) {
}
finally {
    DotnetJs.Greetings();
}
var DotnetJs;
(function (DotnetJs) {
    var ValueType = (function () {
        function ValueType() {
        }
        ValueType.prototype.GetHashCode = function (refresh) {
            throw new DotnetJs.NotImplementedExeption('ValueType.GetHashCode(boolean)');
        };
        return ValueType;
    }());
    DotnetJs.ValueType = ValueType;
})(DotnetJs || (DotnetJs = {}));
