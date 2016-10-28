/// <reference path="errors.ts" />
/// <reference path="valueType.ts" />
interface Object {
    GetHashCode: Function;
    Equals: Function;
    readonly IsValueType: boolean;
    hashCode: number;
}

interface OutParam<T> {
    Value: T;
}

abstract class Crc32Bit {

    private static _crcTbl: number[] = null;
    private static LENGTH: number = 256;
    private static _elemAt = (buf: any, index: number): number => buf[index];

    public static Init(): void {
        if (Crc32Bit._crcTbl != null)
            return
        Crc32Bit._crcTbl = new Array(Crc32Bit.LENGTH);
        var c: number;
        for (var i: number = 0; i < Crc32Bit.LENGTH; i++) {
            c = <number>i;
            for (var j: number = 0; j < 8; j++) {
                if ((c & 1) == 1) {
                    c = 0xEDB88320 ^ (c >> 1);
                }
                else {
                    c >>= 1;
                }
            }
            Crc32Bit._crcTbl[i] = c;
        }
    }

    public static ValueString(buf: string): number {
        var elemAt = (buf: string, index: number) => {
            return buf.charCodeAt(index);
        }
        return Crc32Bit.Value(buf, 0, buf.length, elemAt);
    }

    public static Value(buf: any, offset: number, length: number, elemAt?: (buf: any, index: number) => number): number {
        var c: number = 0xffffffff;
        if (Crc32Bit._crcTbl == null) {
            Crc32Bit.Init();
        }
        elemAt = elemAt || Crc32Bit._elemAt;
        for (var i: number = 0; i < length; i++) {
            var index: number = (c ^ elemAt(buf, i + offset)) & 0xff;
            c = Crc32Bit._crcTbl[index] ^ (c >> 8);
        }
        return ~c;
    }
}

(function () {
    Crc32Bit.Init();
    var id = 0;

    function StringHash(obj: Object): number {
        if (obj.IsValueType) {
            // var result = 0;
            // for (var property in obj) {
            //     if (obj.hasOwnProperty(property)) {
            //         result += StringHash(property);
            //         result += obj[property].GetHashCode();
            //     }
            // }
            // return result;
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

    Object.prototype.GetHashCode = function (refresh?: boolean): number {

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

    Object.prototype.Equals = function (obj: Object): boolean {
        if (!obj.IsValueType)
            return obj === this;

        var vt = <DotnetJs.ValueType>obj;
        return vt.GetHashCode() === this.GetHashCode();
    }


    Array.prototype.GetEnumerator = function () {
        return new ArrayEnumerator(this);
    }
})();
