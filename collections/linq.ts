module DotnetJs.Collections.Linq {

    export class LinqStart<T> {

        protected enumerable: IEnumerable<T>;

        constructor(enumerable: IEnumerable<T>) {
            this.enumerable = enumerable;
        }

        public All(predicate: (item: T) => boolean): boolean {
            return Linq.All(this.enumerable, predicate);
        }

        public Any(predicate?: (item: T) => boolean): boolean {
            return Linq.Any(this.enumerable, predicate);
        }

        public Count(predicate?: (item: T) => boolean): number {
            return Linq.Count(this.enumerable, predicate);
        }

        public ElementAt(enumerable: IEnumerable<T>, index: number): T {
            return Linq.ElementAt(this.enumerable, index);
        }

        public First(predicate?: (item: T) => boolean): T {
            return Linq.First(this.enumerable, predicate);
        }

        public ForEach(action: (item: T) => void): void {
            Linq.ForEach(this.enumerable, action);
        }

        public IndexOf(element: T): number {
            return Linq.IndexOf(this.enumerable, element);
        }

        public LastIndexOf(element: T): number {
            return Linq.LastIndexOf(this.enumerable, element);
        }

        public Select<U>(func: (item: T) => U): LinqChain<T, U> {
            if (this.enumerable == null)
                throw new ArgumentNullException('enumerable');
            if (func == null)
                throw new ArgumentNullException('predicate');
            var linq = new LinqChain<T, U>(this.enumerable, func);
            return linq;
        }

        public Where(predicate: (item: T) => boolean): LinqChain<T, T> {
            if (this.enumerable == null)
                throw new ArgumentNullException('enumerable');
            if (predicate == null)
                throw new ArgumentNullException('predicate');
            var func: (item: T) => T = (item) => {
                if (predicate(item))
                    return item;
                return DefaultDelegate.EmptyReturn;
            };
            var linq = new LinqChain<T, T>(this.enumerable, func);
            return linq;
        }
    }

    export class LinqChain<TSrc, TDes> {

        protected toTDes: (item: TSrc) => TDes;
        protected enumerable: IEnumerable<TSrc>;

        constructor(enumerable: IEnumerable<TSrc>, func?: (item: TSrc) => TDes) {
            this.enumerable = enumerable;
            this.toTDes = func;
        }

        private GetPredicate(predicate?: (item: TDes) => boolean): (item: TSrc) => boolean {
            if (this.toTDes == null)
                throw new ArgumentNullException('toTDes');
            predicate = predicate || DefaultDelegate.Predicate;
            var np: (item: TSrc) => boolean = (item) => {
                let des = this.toTDes(item);
                if (des === DefaultDelegate.EmptyReturn)
                    return false;
                return predicate(des);
            }
            return np;
        }

        private GetFunction<UDes>(func: (item: TDes) => UDes): (item: TSrc) => UDes {
            if (this.toTDes == null)
                throw new ArgumentNullException('toTDes');
            if (func == null)
                throw new ArgumentNullException('func');
            var nf: (item: TSrc) => UDes = (item) => {
                let des = this.toTDes(item);
                if (des != DefaultDelegate.EmptyReturn)
                    return func(des);
                return DefaultDelegate.EmptyReturn;
            }
            return nf;
        }

        private GetAction(action: (item: TDes) => void): (item: TSrc) => void {
            var na: (item: TSrc) => void = (item) => {
                let des = this.toTDes(item);
                if (des != DefaultDelegate.EmptyReturn)
                    action(des);
            }
            return na;
        }

        public All(predicate: (item: TDes) => boolean): boolean {
            var np = this.GetPredicate(predicate);
            return Linq.All(this.enumerable, np);
        }

        public Any(predicate?: (item: TDes) => boolean): boolean {
            var np = this.GetPredicate(predicate);
            return Linq.Any(this.enumerable, np);
        }

        public Count(predicate?: (item: TDes) => boolean): number {
            var np = this.GetPredicate(predicate);
            return Linq.Count(this.enumerable, np);
        }

        public ElementAt(index: number): TDes {
            var elements = this.Execute();
            return Linq.ElementAt(elements, index);
        }

        public First(predicate?: (item: TDes) => boolean): TSrc {
            var np = this.GetPredicate(predicate);
            return Linq.First(this.enumerable, np);
        }

        public ForEach(action: (item: TDes) => void): void {
            var na = this.GetAction(action);
            Linq.ForEach(this.enumerable, na);
        }

        public IndexOf(element: TDes): number {
            var elements = this.Execute();
            return Linq.IndexOf(elements, element);
        }
        
        public LastIndexOf(element: TDes): number {
            var elements = this.Execute();
            return Linq.LastIndexOf(elements, element);
        }

        public Select<UDes>(func: (item: TDes) => UDes): LinqChain<TSrc, UDes> {
            var nf = this.GetFunction<UDes>(func);
            var linq = new LinqChain<TSrc, UDes>(this.enumerable, nf);
            return linq;
        }

        public Where(predicate: (item: TDes) => boolean): LinqChain<TSrc, TDes> {
            var np = this.GetPredicate(predicate);
            var func: (item: TSrc) => TDes = (item) => {
                if (np(item))
                    return item;
                return DefaultDelegate.EmptyReturn;
            };
            var linq = new LinqChain<TSrc, TDes>(this.enumerable, func);
            return linq;
        }

        public Execute(): TDes[] {
            var result: TDes[] = [];
            var action = this.GetAction((item) => result.push(item));
            Linq.ForEach(this.enumerable, action);
            return result;
        }
    }

    abstract class DefaultDelegate {
        public static Predicate = () => true;
        public static Action = () => { };
        public static Func = () => null;

        public static EmptyReturn: any = { value: 'Empty' };
    }

    export function All<T>(enumerable: IEnumerable<T>, predicate: (item: T) => boolean): boolean {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var enumerator = enumerable.GetEnumerator();
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) {
                continue;
            }
            return false;
        }
        return true;
    }

    export function Any<T>(enumerable: IEnumerable<T>, predicate?: (item: T) => boolean): boolean {
        return First(enumerable, predicate) != null;
    }

    export function Count<T>(enumerable: IEnumerable<T>, predicate?: (item: T) => boolean): number {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = enumerable.GetEnumerator();
        var count = 0;
        while (enumerator.MoveNext()) {
            if (predicate(enumerator.Current)) {
                count++;
            }
        }
        return count;
    }

    export function ElementAt<T>(enumerable: IEnumerable<T>, index: number): T {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        if (index < 0)
            throw new ArgumentOutOfRangeException('index: ' + index);
        var enumerator = enumerable.GetEnumerator();
        for (var i = 0; i <= index; i++) {
            if (!enumerator.MoveNext())
                throw new ArgumentOutOfRangeException('index: ' + index);
        }
        return enumerator.Current;
    }

    export function First<T>(enumerable: IEnumerable<T>, predicate?: (item: T) => boolean): T {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        predicate = predicate || DefaultDelegate.Predicate;
        var enumerator = enumerable.GetEnumerator();
        while (enumerator.MoveNext()) {
            let current = enumerator.Current;
            if (predicate(current)) {
                return current;
            }
        }
        return null;
    }

    export function ForEach<T>(enumerable: IEnumerable<T>, action: (item: T) => void): void {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        if (action == null)
            throw new ArgumentNullException('action');
        var enumerator = enumerable.GetEnumerator();
        while (enumerator.MoveNext()) {
            action(enumerator.Current);
        }
    }

    export function IndexOf<T>(enumerable: IEnumerable<T>, element: T): number {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        var enumerator = enumerable.GetEnumerator();
        var index = 0;
        while (enumerator.MoveNext()) {
            if (element === enumerator.Current)
                return index;
            index++;
        }
        return -1;
    }

    export function LastIndexOf<T>(enumerable: IEnumerable<T>, element: T): number {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        var enumerator = enumerable.GetEnumerator();
        var index = 0;
        var rtn = -1;
        while (enumerator.MoveNext()) {
            if (element === enumerator.Current)
                rtn = index;
            index++;
        }
        return rtn;
    }

    export function Select<T, U>(enumerable: IEnumerable<T>, func: (item: T) => U): U[] {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        if (func == null)
            throw new ArgumentNullException('func');
        var enumerator = enumerable.GetEnumerator();
        var result: U[] = [];
        while (enumerator.MoveNext()) {
            let t = func(enumerator.Current);
            result.push(t);
        }
        return result;
    }

    export function Where<T>(enumerable: IEnumerable<T>, predicate: (item: T) => boolean): T[] {
        if (enumerable == null)
            throw new ArgumentNullException('enumerable');
        if (predicate == null)
            throw new ArgumentNullException('predicate');
        var enumerator = enumerable.GetEnumerator();
        var result: T[] = [];
        while (enumerator.MoveNext()) {
            let t = enumerator.Current;
            if (predicate(t))
                result.push(t);
        }
        return result;
    }

}
