interface Object {
    getHashCode: Function;
    isValueType: boolean;
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

    function stringHash(obj: Object): number {
        if (obj.isValueType) {
            var result = 0;
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    result += stringHash(property);
                    result += obj[property].getHashCode();
                }
            }
            return result;
        }
        var string = obj.toString();
        return Crc32Bit.ValueString(string);
    }

    Object.prototype.isValueType = false;

    Object.prototype.getHashCode = function (refresh?: boolean): number {

        if (this.hashCode && !refresh)
            return this.hashCode;

        var type = typeof this.valueOf();
        switch (type) {
            case 'number':
                return this.valueOf();
            case 'object':
                if (this.isValueType) {
                    if (this.hashCode == null)
                        this.hashCode = stringHash(this);
                    return this.hashCode;
                }
                break;
            default:
                return stringHash(this);
        }
        
        var newId = this.getTime == Date.prototype.getTime ? this.getTime() : id++;
        this.hashCode = newId;
        return newId;
    };

    Array.prototype.GetEnumerator = function () {
        return new ArrayEnumerator(this);
    }
})();
