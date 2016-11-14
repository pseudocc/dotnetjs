/// <reference path="errors.ts" />
/// <reference path="../collections/linq.ts" />
/// <reference path="../collections/prim.ts" />

interface String extends DotnetJs.Collections.IEnumerable<number> {
    PadLeft(totalLength: number, paddingChar?: number | string): string;
    PadRight(totalLength: number, paddingChar?: number | string): string;
    StartsWith(value: string, ignoreCase?: boolean);
}

interface StringConstructor {
    Empty: string;
    Join(seperator: string, ...args: string[]);
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
    String.Empty = "";
    Object.freeze(String.Empty);

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

            if (colon > comma && comma != -1)
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

    String.Join = function (seperator: string, ...args: string[]): string {
        if (seperator == null)
            throw new DotnetJs.ArgumentNullException('seperator');
        if (args.length == 0)
            throw new DotnetJs.ArgumentException('args length is zerp');
        var result: string = "";
        args.forEach((value) => result += value);
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
