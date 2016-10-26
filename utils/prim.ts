module DotnetJs {

    export interface IDisposable {
        Dispose(): void;
    }

    export abstract class DefaultDelegate {
        public static Predicate = () => true;
        public static Action = () => { };
        public static Func = () => null;

        public static EmptyReturn: any = { value: 'Empty' };
        public static EqualityComparer: IEqualityComparer<any> = (a, b) => a.Equals(b);
    }

    export type IEqualityComparer<T> = (a: T, b: T) => boolean;

    export type IComparer<T> = (a: T, b: T) => number;

    function GetVersion(): string {
        var Major = 1;
        var Build = 4;
        var Revision = 0;

        return Major + '.' + Build + '.' + Revision;
    }

    export function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
    }

}