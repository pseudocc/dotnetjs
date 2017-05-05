/// <reference path="errors.ts" />
/// <reference path="valueType.ts" />

interface Object {
    ContainsKey: (key: string) => boolean;
    Equals: (obj: Object) => boolean;
    GetHashCode: (refresh?: boolean) => number;
    readonly IsValueType: boolean;
    hashCode: number;
}

(function () {
    var id = 0x7FEFFFFD;

    function StringHash(obj: Object): number {
        var value = obj.toString();
        var m, n = 0x15051505;
        var offset = 0;
        var mask = 0xFFFFFFFF;
        for (var i = value.length; i > 0; i -= 4) {
            m = (((m << 5) + m) + (m >> 0x1b)) ^ value.charCodeAt(0 + offset) & mask;
            if (i <= 2) {
                break;
            }
            n = (((n << 5) + n) + (n >> 0x1b)) ^ value.charCodeAt(1 + offset) & mask;
            offset += 2;
        }
        return (m + (n * 0x5d588b65)) & mask;
    }

    Object.defineProperty(Object.prototype, 'ContainsKey', {
        value: function (_key: string): boolean {
            if (this[key] != null)
                return true;
            for (var key in this) {
                if (key == _key) 
                    return true;
            }
            return false;
        },
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'Equals', {
        value: function (obj: Object): boolean {
            if (!obj.IsValueType)
                return obj === this;

            var vt = <DotnetJs.ValueType>obj;
            return vt.GetHashCode() === this.GetHashCode();
        },
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'GetHashCode', {
        value: function (refresh?: boolean): number {
            if (this.hashCode && !refresh)
                return this.hashCode;

            var value = this.valueOf();
            var type = typeof value;
            switch (type) {
                case 'number':
                    return value;
                case 'boolean':
                    return value ? 1 : 0;
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
        },
        enumerable: false
    });

    Object.defineProperty(Object.prototype, 'IsValueType', {
        get: function () {
            var value = this.valueOf();
            var type = typeof value;
            return type == 'number'
                || type == 'boolean'
                || type == 'string'
                || value instanceof DotnetJs.ValueType;
        },
        enumerable: false
    });
    
    Array.prototype.GetEnumerator = function () {
        return new ArrayEnumerator(this);
    }
})();
