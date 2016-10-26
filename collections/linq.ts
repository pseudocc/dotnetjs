module DotnetJs.Linq {

    export function LinqStart<TSource>(source: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource> {
        return new LinqIntermediate<TSource, TSource>(source, item => item);
    }

    export class LinqIntermediate<TSource, TResult> implements Collections.IEnumerable<TResult> {

        protected toResult: (item: TSource) => TResult;
        protected source: Collections.IEnumerable<TSource>;

        constructor(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult) {
            this.source = source;
            this.toResult = func;
        }

        public GetEnumerator(): Collections.IEnumerator<TResult> {
            return new LinqEnumerator(this.source, this.toResult);
        }

        public Aggregate<TAccumulate>(seed: TAccumulate, func: (acc: TAccumulate, item: TResult) => TAccumulate): TAccumulate {
            return Linq.Aggregate(this, seed, func);
        }

        public Average(): number {
            return Linq.Average(<any>this);
        }

        public All(predicate: (item: TResult) => boolean): boolean {
            return Linq.All(this, predicate);
        }

        public Any(predicate?: (item: TResult) => boolean): boolean {
            return Linq.Any(this, predicate);
        }

        public Concat(enumerable: Collections.IEnumerable<TResult>): LinqIntermediate<TResult, TResult> {
            return Linq.Concat(this, enumerable);
        }

        public Contains(element: TResult, comparer?: IEqualityComparer<TResult>): boolean {
            return Linq.Contains(this, element, comparer);
        }

        public Count(predicate?: (item: TResult) => boolean): number {
            return Linq.Count(this, predicate);
        }

        public ElementAt(index: number): TResult {
            return Linq.ElementAt(this, index);
        }

        public Except(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult> {
            return Linq.Except(this, enumerable, comparer);
        }

        public First(predicate?: (item: TResult) => boolean): TResult {
            return Linq.First(this, predicate);
        }

        public ForEach(action: (item: TResult) => void): void {
            Linq.ForEach(this, action);
        }

        public IndexOf(element: TResult): number {
            return Linq.IndexOf(this, element);
        }

        public Intersect(enumerable: Collections.IEnumerable<TResult>, comparer?: IEqualityComparer<TResult>): LinqIntermediate<TResult, TResult> {
            return Linq.Intersect(this, enumerable, comparer);
        }

        public LastIndexOf(element: TResult): number {
            return Linq.LastIndexOf(this, element);
        }

        public Max(comparer?: IComparer<TResult>): TResult {
            return Linq.Max(this, comparer);
        }

        public Min(comparer?: IComparer<TResult>): TResult {
            return Linq.Min(this, comparer);
        }

        public Select<UDes>(func: (item: TResult) => UDes): LinqIntermediate<TResult, UDes> {
            return Linq.Select(this, func);
        }

        public Where(predicate: (item: TResult) => boolean): LinqIntermediate<TResult, TResult> {
            return Linq.Where(this, predicate);
        }

        public ToArray(): TResult[] {
            return Linq.ToArray(this);
        }

        public ToList(): Collections.List<TResult> {
            return Linq.ToList(this);
        }
    }

    class LinqEnumerator<TSource, TResult> implements Collections.IEnumerator<TResult> {

        private toResult: (item: TSource) => TResult;
        private enumerator: Collections.IEnumerator<TSource>;

        constructor(source: Collections.IEnumerable<TSource>, toResult: (item: TSource) => TResult) {
            this.enumerator = source.GetEnumerator();
            this.toResult = toResult;
        }

        public MoveNext(): boolean {
            var next = this.enumerator.MoveNext();
            while (next && this.Current === DefaultDelegate.EmptyReturn) {
                next = this.enumerator.MoveNext();
            }
            return next;
        }

        public get Current(): TResult {
            return this.toResult(this.enumerator.Current);
        }

        public Reset(): void {
            this.enumerator.Reset();
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
        ForEach(source, (item) => {
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
            if (predicate(enumerator.Current)) {
                continue;
            }
            return false;
        }
        return true;
    }

    export function Any<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): boolean {
        return Linq.Count(source, predicate) === 0;
    }

    export function Concat<TSource>(first: Collections.IEnumerable<TSource>, second: Collections.IEnumerable<TSource>): LinqIntermediate<TSource, TSource> {
        if (first == null)
            throw new ArgumentNullException('first');
        if (second == null)
            throw new ArgumentNullException('second');
        var result: TSource[] = [];
        var enumerators = [first.GetEnumerator(), second.GetEnumerator()];
        for (var i = 0; i < 2; i++)
            while (enumerators[i].MoveNext()) {
                result.push(enumerators[i].Current);
            }
        var linq = new LinqIntermediate<TSource, TSource>(result, (item) => item);
        return linq;
    }

    export function Contains<TSource>(source: Collections.IEnumerable<TSource>, element: TSource, comparer?: IEqualityComparer<TSource>): boolean {
        if (element == null)
            throw new ArgumentNullException('element');
        comparer = comparer || DefaultDelegate.EqualityComparer;
        return Linq.Any(source, (item) => comparer(item, element));
    }

    export function Count<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): number {
        if (source == null)
            throw new ArgumentNullException('source');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = source.GetEnumerator();
        var count = 0;
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) {
                count++;
            }
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
        var result: TSource[] = [];
        var enumerator = first.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (!Linq.Contains(second, enumerator.Current, comparer))
                result.push(enumerator.Current);
        }
        var linq = new LinqIntermediate<TSource, TSource>(result, (item) => item);
        return linq;
    }

    export function First<TSource>(source: Collections.IEnumerable<TSource>, predicate?: (item: TSource) => boolean): TSource {
        if (source == null)
            throw new ArgumentNullException('source');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext()) {
            let current = enumerator.Current;
            if (predicate(current)) {
                return current;
            }
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
        var result: TSource[] = [];
        var enumerator = first.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (Linq.Contains(second, enumerator.Current, comparer))
                result.push(enumerator.Current);
        }
        var linq = new LinqIntermediate<TSource, TSource>(result, (item) => item);
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
        return Linq.Max(source, reverseComparer);
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
        var linq = new LinqIntermediate<number, number>(result, (item) => item);
        return linq;
    }

    export function Repeat<TResult>(element: TResult, count: number): LinqIntermediate<TResult, TResult> {
        if (count == null)
            throw new ArgumentNullException('count');
        var result: TResult[] = [];
        for (var i = 0; i < count; i++) {
            result.push(element);
        }
        var linq = new LinqIntermediate<TResult, TResult>(result, (item) => item);
        return linq;
    }

    export function Select<TSource, TResult>(source: Collections.IEnumerable<TSource>, func: (item: TSource) => TResult): LinqIntermediate<TSource, TResult> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (func == null)
            throw new ArgumentNullException('func');
        var linq = new LinqIntermediate<TSource, TResult>(source, func);
        return linq;
    }

    export function ToArray<TSource>(source: Collections.IEnumerable<TSource>): TSource[] {
        if (source == null)
            throw new ArgumentNullException('source');
        var enumerator = source.GetEnumerator();
        var result: TSource[] = [];
        while (enumerator.MoveNext()) {
            result.push(enumerator.Current);
        }
        return result;
    }

    export function ToList<TSource>(source: Collections.IEnumerable<TSource>): Collections.List<TSource> {
        return new Collections.List(ToArray(source));
    }

    export function Where<TSource>(source: Collections.IEnumerable<TSource>, predicate: (item: TSource) => boolean): LinqIntermediate<TSource, TSource> {
        if (source == null)
            throw new ArgumentNullException('source');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var func: (item: TSource) => TSource = (item) => {
            if (predicate(item))
                return item;
            return DefaultDelegate.EmptyReturn;
        };
        var linq = new LinqIntermediate<TSource, TSource>(source, func);
        return linq;
    }

}
