var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../dist/dotnet.d.ts" />
var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo() {
        _super.apply(this, arguments);
    }
    Foo.prototype.GetHashCode = function (refresh) {
        return this.PropertyA ^ this.PropertyB;
    };
    return Foo;
}(DotnetJs.ValueType));
var foo = new Foo();
var err = new Error();
foo.PropertyA = 223;
foo.PropertyB = 332;
console.log('--- foo ---');
console.log('hashcode:', foo.GetHashCode());
console.log('isValueType:', foo.IsValueType);
console.log('--- err ---');
console.log('hashcode:', err.GetHashCode());
console.log('isValueType:', err.IsValueType);
