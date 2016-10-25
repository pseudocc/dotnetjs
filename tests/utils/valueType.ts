/// <reference path="../../dist/dotnet.d.ts" />
class Foo extends DotnetJs.ValueType {
    public PropertyA: number;
    public PropertyB: number;
    public GetHashCode(refresh?: boolean): number {
        return this.PropertyA ^ this.PropertyB;
    }
}
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
