/// <reference path="../../dist/dotnet.d.ts" />
var List = DotnetJs.Collections.List;
var Linq = DotnetJs.Collections.Linq;
var index = 0;
var list = new List();

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

seed = expression.Aggregate(seed, function (acc, item) { return (acc + item.foo); });
console.log('seed:', seed); // 36.

expression.Where(function (item) {
    return item.bar === '__1' && !item.wtf;
}).ForEach(function (item) {
    return console.log(item.getHashCode());
}); // 0 1

var avg = expression.Select(function (item) {
    return item.foo;
}).Where(function (item) {
    return item <= 5;
}).Average();
console.log(avg); // 2.5
