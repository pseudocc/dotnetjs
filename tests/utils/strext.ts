/// <reference path="../../dist/dotnet.d.ts" />
console.log('--- string extension test ---');
class Foo {
    public bar: number;
    public toString(format: string) {
        if (format == null)
            return this.bar.toString();
        if (format == '!')
            return '!' + this.bar;
        return '?' + this.bar;
    }
}

var foo = new Foo();
foo.bar = 65521;

console.log(String.Format('test Foo toString: {0:!}, {0:?}, {0,10}', foo));