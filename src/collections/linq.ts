module DotnetJs.Linq {

    export function LinqStart<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource> {
        return new LinqIntermediate<TSource, TSource>([source], DefaultDelegate.SelfReturn);
    }

    export class LinqIntermediate<TSource, TResult> implements Collections.IEnumerable<TResult> {

        protected toResult: (item: TSource, index: number) => TResult;
        protected sources: Collections.IEnumerable<TSource>[];

        constructor(sources: Collections.IEnumerable<TSource>[], func: (item: TSource, index: number) => TResult) {
            this.sources = sources;
            this.toResult = func;
        }

        public GetEnumerator(): Collections.IEnumerator<TResult> {
            return new LinqEnumerator(this.sources, this.toResult);
        }

        public Aggregate<TAccumulate>(seed: TAccumulate, func: (acc: TAccumulate, item: TResult) => TAccumulate): TAccumulate {
            return Aggregate(this, seed, func);
        }

        public Average(): number {
            return Average(<any>this);
        }

        public All(predicate: (item: TResult) => boolean): boolean {
            return All(this, predicate);
        }

        public Any(predicate?: (item: TResult) => boolean): boolean {
            return Any(this, predicate);
        }

        public Concat(enumerable: Collections.IEnumerable<TResult>): LinqIntermediate<TResult, TResult> {
            return Concat(this, enumerable);
        }

        public Contains(element: TResult, comparer?: IEqualityComparer<TResult>): boolean {
            return Contains(this, element, comparer);
        }

        public Count(predicate?: (item: TResult) => boolean): number {
            return Count(this, predicate);
        }

        public ElementAt(index: number): TResult {
            return ElementAt(this, index);
        }

        public Except(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult> {
            return Except(this, enumerable, comparer);
        }

        public First(predicate?: (item: TResult) => boolean): TResult {
            return First(this, predicate);
        }

        public ForEach(action: (item: TResult) => void): void {
            ForEach(this, action);
        }

        public IndexOf(element: TResult): number {
            return IndexOf(this, element);
        }

        public Intersect(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult> {
            return Intersect(this, enumerable, comparer);
        }

        public LastIndexOf(element: TResult): number {
            return LastIndexOf(this, element);
        }

        public Max(comparer?: IComparer<TResult>): TResult {
            return Max(this, comparer);
        }

        public Min(comparer?: IComparer<TResult>): TResult {
            return Min(this, comparer);
        }

        public Reverse(): LinqIntermediate<TResult, TResult> {
            return Reverse(this);
        }

        public Select<UDes>(func: (item: TResult) => UDes): LinqIntermediate<TResult, UDes> {
            return Select(this, func);
        }

        public SequenceEqual(second: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TSource>): boolean {
            return SequenceEqual(this, second);
        }

        public SkipWhile(predicate: (item: TResult, index: number) => boolean): LinqIntermediate<TResult, TResult> {
            return SkipWhile(this, predicate);
        }

        public TakeWhile(predicate: (item: TResult, index: number) => boolean): LinqIntermediate<TResult, TResult> {
            return TakeWhile(this, predicate);
        }

        public ToArray(): TResult[] {
            return ToArray(this);
        }

        public ToDictionary<TKey, TElement>(keyValueSelector: (item: TResult) => Collections.KeyValuePair<TKey, TElement>): Collections.Dictionary<TKey, TElement> {
            return ToDictionary(this, keyValueSelector);
        }

        public ToList(): Collections.List<TResult> {
            return ToList(this);
        }

        public Where(predicate: (item: TResult) => boolean): LinqIntermediate<TResult, TResult> {
            return Where(this, predicate);
        }

    }

    class LinqEnumerator<TSource, TResult> implements Collections.IEnumerator<TResult> {

        private toResult: (item: TSource, index: number) => TResult;
        private enumerator: Collections.IEnumerator<TSource>;
        private sources: Collections.IEnumerable<TSource>[];
        private sourceIndex = 0;
        private index = -1;

        constructor(sources: Collections.IEnumerable<TSource>[], toResult: (item: TSource, index: number) => TResult) {
            this.sources = sources;
            this.enumerator = sources[this.sourceIndex].GetEnumerator();
            this.toResult = toResult;
        }

        private SourceMoveNext(): boolean {
            var next = this.enumerator.MoveNext();
            this.index++;
            return next;
        }

        public MoveNext(): boolean {
            var next = this.SourceMoveNext();
            while (next && this.Current === DefaultDelegate.EmptyReturn) {
                next = this.SourceMoveNext();
            }
            while (!next && ++this.sourceIndex < this.sources.length) {
                this.enumerator = this.sources[this.sourceIndex].GetEnumerator();
                next = this.SourceMoveNext();
            }
            return next;
        }

        public get Current(): TResult {
            return this.toResult(this.enumerator.Current, this.index);
        }

        public Reset(): void {
            this.sourceIndex = 0;
            this.enumerator = this.sources[this.sourceIndex].GetEnumerator();
        }

        public Dispose(): void {
            this.enumerator.Dispose();
        }

    }

    export function Aggregate<TSource, TAccumulate>(source: Collections.IEnumerable<TSource>, seed: TAccumulate, func: (acc: TAccumulate, item: TSource) => TAccumulate): TAccumulate {
        if (seed == null)
            throw new ArgumentNullException('seed');
        if (func == null)
            throw new ArgumentNullException('func');
        ForEach(source, item => {
            seed = func(seed, item);
        });
        return seed;
    }

    export function Average(source: Collections.IEnumerable<number>): number {
        if (source == null)
            throw new ArgumentNullException('source');
        var result = 0;
        var length = 0;
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (typeof enumerator.Current != 'number')
                throw new ArgumentException('not a number');
            length++;
            result += enumerator.Current;
        }
        return result / length;
    }

    export function All<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): boolean {
        if (source == null)
            throw new ArgumentNullException('source');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) 
                continue;
            return false;
        }
        return true;
    }

    export function Any<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): boolean {
        if (source == null)
            throw new ArgumentNullException('source');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) 
                return true;
        }
        return false;
    }

    export function Concat<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource> {
        if (first == null)
            throw new ArgumentNullException('first');
        if (second == null)
            throw new ArgumentNullException('second');
        var result = [first, second];
        var linq = new LinqIntermediate<TSource, TSource>(result, DefaultDelegate.SelfReturn);
        return linq;
    }

    export function Contains<TSource>(source: Collections.IEnumerable<TSource>, element: TSource, comparer?: IEqualityComparer<TSource>): boolean {
        if (element == null)
            throw new ArgumentNullException('element');
        comparer = comparer || DefaultDelegate.EqualityComparer;
        return Any(source, item => comparer(item, element));
    }

    export function Count<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): number {
        if (source == null)
            throw new ArgumentNullException('source');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = source.GetEnumerator();
        var count = 0;
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) 
                count++;
        }
        return count;
    }

    export function ElementAt<TSource>(source: Collections.IEnumerable<TSource>, index: number): TSource {
        if (source == null)
            throw new ArgumentNullException('source');
        if (index < 0)
            throw new ArgumentOutOfRangeException('index: ' + index);
        var enumerator = source.GetEnumerator();
        for (var i = 0; i <= index; i++) {
            if (!enumerator.MoveNext())
                throw new ArgumentOutOfRangeException('index: ' + index);
        }
        return enumerator.Current;
    }

    export function Except<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): LinqIntermediate<TSource, TSource> {
        if (first == null)
            throw new ArgumentNullException('first');
        if (second == null)
            throw new ArgumentNullException('second');
        var func = (item: TSource) => {
            if (!Contains(second, item, comparer))
                return item;
            return DefaultDelegate.EmptyReturn;
        }
        var linq = new LinqIntermediate<TSource, TSource>([first], func);
        return linq;
    }

    export function First<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): TSource {
        if (source == null)
            throw new ArgumentNullException('source');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            let current = enumerator.Current;
            if (predicate(current)) 
                return current;
        }
        return null;
    }

    export function ForEach<TSource>(source: Collections.IEnumerable<TSource>, action: (item: TSource) => void): void {
        if (source == null)
            throw new ArgumentNullException('source');
        if (action == null)
            throw new ArgumentNullException('action');
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            action(enumerator.Current);
        }
    }

    export function IndexOf<TSource>(source: Collections.IEnumerable<TSource>, element: TSource): number {
        if (source == null)
            throw new ArgumentNullException('source');
        var enumerator = source.GetEnumerator();
        var index = 0;
        while (enumerator.MoveNext()) {
            if (element === enumerator.Current)
                return index;
            index++;
        }
        return -1;
    }

    export function Intersect<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): LinqIntermediate<TSource, TSource> {
        if (first == null)
            throw new ArgumentNullException('first');
        if (second == null)
            throw new ArgumentNullException('second');
        var func = (item: TSource) => {
            if (Contains(second, item, comparer))
                return item;
            return DefaultDelegate.EmptyReturn;
        }
        var linq = new LinqIntermediate<TSource, TSource>([first], func);
        return linq;
    }

    export function LastIndexOf<TSource>(source: Collections.IEnumerable<TSource>, element: TSource): number {
        if (source == null)
            throw new ArgumentNullException('source');
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

    export function Max<TSource>(source: Collections.IEnumerable<TSource>, comparer?: IComparer<TSource>): TSource {
        if (source == null)
            throw new ArgumentNullException('source');
        comparer = comparer || ((a, b) => {
            if (a === b) return 0;
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        var max: TSource = null;
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            let current = enumerator.Current;
            if (comparer(max, current) > 0 && current != null)
                max = current;
        }
        return max;
    }

    export function Min<TSource>(source: Collections.IEnumerable<TSource>, comparer?: IComparer<TSource>): TSource {
        var reverseComparer = comparer || ((a, b) => {
            if (a === b) return 0;
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        });
        return Max(source, reverseComparer);
    }

    export function Range(start: number, count: number): LinqIntermediate<number, number> {
        if (start == null)
            throw new ArgumentNullException('start');
        if (count == null)
            throw new ArgumentNullException('count');
        var result: number[] = [];
        for (var i = start; i < start + count; i++) {
            result.push(i);
        }
        var linq = new LinqIntermediate<number, number>([result], DefaultDelegate.SelfReturn);
        return linq;
    }

    export function Repeat<TResult>(element: TResult, count: number): LinqIntermediate<TResult, TResult> {
        if (count == null)
            throw new ArgumentNullException('count');
        var result: TResult[] = [];
        for (var i = 0; i < count; i++) {
            result.push(element);
        }
        var linq = new LinqIntermediate<TResult, TResult>([result], DefaultDelegate.SelfReturn);
        return linq;
    }

    export function Reverse<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource> {
        if (source == null)
            throw new ArgumentNullException('source');
        var enumerator = source.GetEnumerator();
        var result: TSource[] = [];
        while (enumerator.MoveNext()) {
            result.unshift(enumerator.Current);
        }
        return LinqStart(result);
    }

    export function Select<TSource, TResult>(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult): LinqIntermediate<TSource, TResult> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (func == null)
            throw new ArgumentNullException('func');
        var linq = new LinqIntermediate<TSource, TResult>([source], func);
        return linq;
    }

    export function SequenceEqual<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>, comparer?: IEqualityComparer<TSource>): boolean {
        if (first == null)
            throw new ArgumentNullException('first');
        if (second == null)
            throw new ArgumentNullException('second');
        comparer = comparer || DefaultDelegate.EqualityComparer;
        var fe = first.GetEnumerator();
        var se = second.GetEnumerator();
        while (fe.MoveNext()) {
            if (!se.MoveNext())
                return false;
            if (!comparer(fe.Current, se.Current))
                return false;
        }
        return !se.MoveNext();
    }

    export function SkipWhile<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource, index: number) => boolean): LinqIntermediate<TSource, TSource> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var func: (item: TSource, index: number) => TSource = (item, index) => {
            if (predicate(item, index))
                return DefaultDelegate.EmptyReturn;
            return item;
        };
        var linq = new LinqIntermediate<TSource, TSource>([source], func);
        return linq;
    }

    export function TakeWhile<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource, index: number) => boolean): LinqIntermediate<TSource, TSource> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var func: (item: TSource, index: number) => TSource = (item, index) => {
            if (predicate(item, index))
                return item;
            return DefaultDelegate.EmptyReturn;
        };
        var linq = new LinqIntermediate<TSource, TSource>([source], func);
        return linq;
    }

    export function ToArray<TSource>(source: Collections.IEnumerable<TSource>): TSource[] {
        if (source == null)
            throw new ArgumentNullException('source');
        var enumerator = source.GetEnumerator();
        var result: TSource[] = [];
        var i = 0;
        while (enumerator.MoveNext()) {
            result[i++] = enumerator.Current;
        }
        return result;
    }

    export function ToDictionary<TSource, TKey, TElement>(source: Collections.IEnumerable<TSource>,
        keyValueSelector: (item: TSource) => Collections.KeyValuePair<TKey, TElement>,
        keyComparer?: IEqualityComparer<TKey>): Collections.Dictionary<TKey, TElement> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (keyValueSelector == null)
            throw new ArgumentNullException('keyValueSelector');
        // To avoid Dictionary.Resize()
        var array: TSource[] = ToArray(source);
        var dict = new Collections.Dictionary<TKey, TElement>(array.length, keyComparer);
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            let pair = keyValueSelector(enumerator.Current);
            if (pair == null)
                continue;
            dict.Add(pair.Key, pair.Value);
        }
        return dict;
    }

    export function ToList<TSource>(source: Collections.IEnumerable<TSource>): Collections.List<TSource> {
        return new Collections.List(ToArray(source));
    }

    export function Where<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): LinqIntermediate<TSource, TSource> {
        return TakeWhile(source, predicate);
    }

}
