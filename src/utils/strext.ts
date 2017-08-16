/// <reference path="errors.ts" />
/// <reference path="../collections/linq.ts" />
/// <reference path="../collections/prim.ts" />

module DotnetJs.Char {

    export function IsControl(value: string, index?: number): boolean {
        Ensure(value, index);
        var code = value.charCodeAt(index || 0);
        if (code >= 0 && code <= 31)
            return true;
        if (code >= 127 && code <= 159)
            return true;
        return false;
    }

    export function IsDigit(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        return (value >= '0') && (value <= '9');
    }

    export function IsLetter(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        return IsLower(value) || IsUpper(value);
    }

    export function IsLower(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        return (value >= 'a') && (value <= 'z');
    }

    export function IsPunctuation(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        switch (value) {
            case '!': case '"': case '#': case '%':
            case '&': case '\'': case '(': case ')':
            case '*': case ',': case '-': case '.':
            case '/': case ':': case ';': case '?':
            case '@': case '[': case '\\': case ']':
            case '_': case '{': case '}': return true;
            default:
                return false;
        }
    }

    export function IsSeparator(value: string, index?: number) {
        Ensure(value, index);
        var code = value.charCodeAt(index || 0);
        if (code >= 8192 && code <= 8202)
            return true;
        switch (code) {
            case 32: case 160: case 5760: case 6158:
            case 8239: case 8287: case 12288: return true;
            default:
                return false;
        }
    }

    export function IsUpper(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        return (value >= 'A') && (value <= 'Z');
    }

    export function IsWhiteSpace(value: string, index?: number): boolean {
        Ensure(value, index);
        value = value.charAt(index || 0);
        return value == ' ';
    }

    function Ensure(value: string, index?: number): void {
        if (value == null)
            throw new DotnetJs.ArgumentNullException('value');
        if (index == null && value.length != 1)
            throw new DotnetJs.InvalidDataException(value + ' is not a char but a string');
        if ((index || -1) >= value.length)
            throw new DotnetJs.ArgumentOutOfRangeException('index = ' + index);
    }
}

interface String extends DotnetJs.Collections.IEnumerable<number> {
    PadLeft(totalLength: number, paddingChar?: number | string): string;
    PadRight(totalLength: number, paddingChar?: number | string): string;
    StartsWith(value: string, ignoreCase?: boolean);
}

interface StringConstructor {
    Empty: string;
    Join(seperator: string, enumerable: DotnetJs.Collections.IEnumerable<string>);
    Format(value: string, ...args): string;
    IsNullOrEmpty(value: string): boolean;
    IsNullOrWhiteSpace(value: string): boolean;
}

class StringEnumerator implements DotnetJs.Collections.IEnumerator<number> {
    private source: String;
    private index: number;
    private current: number;

    constructor(str: String) {
        this.source = str;
        this.index = 0;
        this.current = null;
    }

    public MoveNext(): boolean {
        if (this.index >= this.source.length)
            return false;

        this.current = this.source.charCodeAt(this.index++);
        return true;
    }

    public get Current(): number {
        return this.current;
    }

    public Reset(): void {
        this.index = 0;
    }

    public Dispose(): void {

    }
}

(function () {
    var _empty = "";
    Object.defineProperty(String, 'Empty', {
        get: function() {
            return _empty;
        },
        enumerable: false
    });

    String.Format = function (value: string, ...args: Object[]): string {
        // match case: {index[,alignment][:formatString]}
        return value.replace(/{(\d+(,[-\d]+)?(:[^\t\r\n\{\}]+)?)}/g, function (match: string, content: string) {
            var exp = DotnetJs.Linq.LinqStart(content);
            var colon = exp.IndexOf(':'.charCodeAt(0));
            var comma = exp.IndexOf(','.charCodeAt(0));
            var index: number;
            var format: string;
            var alignment: number;

            var getNumber = (left: number, right?: number): number => {
                let result = content.substring(left, right);
                return parseInt(result);
            }

            var tryGetString = (i: number, f?: string): string => {
                if (i >= args.length)
                    throw new DotnetJs.ArgumentOutOfRangeException('args[' + i + ']');
                var result = args[index];
                if (typeof result === 'undefined')
                    return 'undefined';
                if (result == null)
                    return null;
                if (f == null)
                    return result.toString();
                return <string>result.toString.apply(result, [f]);
            }

            if (colon < comma && comma != -1 && colon != -1)
                throw new DotnetJs.ArgumentException('malformated');
            if (colon == -1 && comma == -1) {
                index = parseInt(content);
                return tryGetString(index);
            }
            if (colon != -1) {
                // has [:formatString]
                format = content.substring(colon + 1);
                index = (comma == -1) ? getNumber(0, colon) : getNumber(0, comma);
            }
            if (comma != -1) {
                // has [,alignment]
                index = index || getNumber(0, comma);
                alignment = (colon == -1) ? getNumber(comma + 1) : getNumber(comma + 1, colon);
            }
            var result = tryGetString(index, format);
            if (alignment == null)
                return result;
            return (alignment < 0) ? result.PadRight(-alignment) : result.PadLeft(alignment);
        });
    }

    String.Join = function (seperator: string,  enumerable: DotnetJs.Collections.IEnumerable<string>): string {
        if (seperator == null)
            throw new DotnetJs.ArgumentNullException('seperator');
        if (enumerable == null)
            throw new DotnetJs.ArgumentNullException('array');
        var enumerator = enumerable.GetEnumerator();
        var result = "";
        var last, current: string;
        current = null;
        while (true) {
            last = current;
            current = enumerator.MoveNext() ? enumerator.Current : null;
            if (last == null)
                continue;
            result += last;
            if (current == null)
                break;
            result += seperator;
        }
        return result;
    }

    String.IsNullOrEmpty = function (value: string): boolean {
        if (value == null || value == String.Empty)
            return true;
        return false;
    }

    String.IsNullOrWhiteSpace = function (value: string): boolean {
        if (value == null)
            return true;

        return value.replace(/\s/g, String.Empty).length < 1;
    }

    function internalPad(spaceLength: number, paddingChar?: number | string): string {
        paddingChar = paddingChar || ' ';
        if (typeof paddingChar === 'string') {
            if (paddingChar.length > 1)
                throw new DotnetJs.ArgumentException('paddingChar is not a char, but a string.');
            paddingChar = paddingChar.charCodeAt(0);
        }
        var spaces = DotnetJs.Linq.Repeat(<number>paddingChar, spaceLength).ToArray();
        return <string>String.fromCharCode.apply(null, spaces);
    }

    String.prototype.GetEnumerator = function (): DotnetJs.Collections.IEnumerator<number> {
        return new StringEnumerator(this);
    }

    String.prototype.PadLeft = function (totalLength: number, paddingChar?: number | string): string {
        if (totalLength == null)
            throw new DotnetJs.ArgumentNullException('value');
        if (totalLength < 0)
            throw new DotnetJs.ArgumentOutOfRangeException('totalLength < 0');
        var me = <string>this;
        var spaceLength = totalLength - me.length;
        return internalPad(spaceLength, paddingChar) + me;
    }

    String.prototype.PadRight = function (totalLength: number, paddingChar?: number | string): string {
        if (totalLength == null)
            throw new DotnetJs.ArgumentNullException('value');
        if (totalLength < 0)
            throw new DotnetJs.ArgumentOutOfRangeException('totalLength < 0');
        var me = <string>this;
        var spaceLength = totalLength - me.length;
        return me + internalPad(spaceLength, paddingChar);
    }

    String.prototype.StartsWith = function (value: string, ignoreCase?: boolean) {
        if (value == null)
            throw new DotnetJs.ArgumentNullException('value');
        var me = <string>this;
        if (me.length < value.length)
            return false;
        var sub = me.substring(0, value.length);
        if (ignoreCase) {
            sub = sub.toLowerCase();
            value = value.toLowerCase();
        }
        return sub === value;
    }

})();
