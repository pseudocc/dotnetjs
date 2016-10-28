/// <reference path="../../dist/dotnet.d.ts" />
console.log('--- linq test ---');
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
console.log('seed:', seed); 
// seed: 36

expression.Where(item => item.bar === '__1' && !item.wtf).ForEach(item => console.log(item.GetHashCode())); 
// 0
// 1

var avg = expression.Select(item => item.foo).Where(item => item <= 5).Average();
console.log('Average:', avg);
// Average: 2.5

expression.SkipWhile((item, index) => item.bar === '__0' || index > 5).ForEach(item => console.log(item.foo, item.bar)); 
// 3 "__1"
// 4 "__1"
// 5 "__1"

expression.Where(item => item.wtf).ToDictionary((item) => {
    return {Key: item.foo, Value: item.bar};
}).ForEach((item) => console.log('key:', item.Key + ',', 'value:', item.Value));
// key: 2, value: __0
// key: 3, value: __1
// key: 7, value: __2
