/// <reference path="version.ts" />
module DotnetJs {

    export interface IDisposable {
        Dispose(): void;
    }

    export interface ICloneable {
        Clone(): Object;
    }

    export interface IComparable<T> {
        CompareTo(first: T, second: T): number;
    }

    export interface IEquatable<T> {
        Equals(obj: T): boolean;
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

    function GetVersion(): Version {
        return new Version(1, 4, 2, 14);
    }

    export function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
    }

}