/// <reference path="../../dist/dotnet.d.ts" />
var List = DotnetJs.Collections.List;
var Linq = DotnetJs.Linq;

type InternalType = {
    foo: number;
    bar: string;
    wtf: boolean;
}

var index = 0;
var list = new List<InternalType>();
list.Add({ foo: index++, bar: '__0', wtf: false });
list.Add({ foo: index++, bar: '__0', wtf: false });
list.Add({ foo: index++, bar: '__0', wtf: true });

list.Add({ foo: index++, bar: '__1', wtf: true });
list.Add({ foo: index++, bar: '__1', wtf: false });
list.Add({ foo: index++, bar: '__1', wtf: false });

list.Add({ foo: index++, bar: '__2', wtf: false });
list.Add({ foo: index++, bar: '__2', wtf: true });
list.Add({ foo: index++, bar: '__2', wtf: false });

var seed = 0;
var expression = Linq.LinqStart(list);
seed = expression.Aggregate(seed, (acc, item) => (acc + item.foo));
console.log('seed:', seed); // output should be 36.

expression.Where(item => item.bar === '__1' && !item.wtf).ForEach(item => console.log(item.getHashCode())); // output should be 0 1

expression.Select(item => item.foo).Where(item => item <= 5).Average();