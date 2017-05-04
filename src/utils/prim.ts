/// <reference path="version.ts" />
/// <reference path="cslext.ts" />
/// <reference path="numext.ts" />
/// <reference path="objext.ts" />

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

    export type OutParam<T> = (out) => void;

    export type IEqualityComparer<T> = (a: T, b: T) => boolean;

    export type IComparer<T> = (a: T, b: T) => number;

    function GetVersion(): Version {
        return new Version(1, 7, 0, 68);
    }

    export function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
        console.log('DotnetJs is released under the MIT license by Master Yu.')
        console.log('See the full license at https://github.com/Master76/dotnetjs/blob/master/LICENSE.');
    }

}