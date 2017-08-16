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
        public static SelfReturn = item => item;

        public static EmptyReturn: any = { value: 'Empty' };
        public static EqualityComparer: IEqualityComparer<any> = (a, b) => a.Equals(b);
    }

    export type OutParam<T> = (outValue) => void;

    export type IEqualityComparer<T> = (a: T, b: T) => boolean;

    export type IComparer<T> = (a: T, b: T) => number;

    function GetVersion(): Version {
        return new Version(1, 7, 3, 74);
    }

    let said = false;

    export function Greetings() {
        if (said) 
            return;
        said = true;
        let version = GetVersion();
        console.log('DotNetJs -', version.toString(), '- https://github.com/Master76/dotnetjs/ - (MIT license)');
    }

}