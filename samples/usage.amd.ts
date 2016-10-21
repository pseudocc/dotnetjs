/// <reference path="../dist/dotnet.d.ts" />
var HashTable = DotnetJs.Collections.HashTable;
var Linq = DotnetJs.Collections.Linq;

type LocalKey = {
    value: string;
}

var ht = new HashTable<LocalKey, string>();
ht.Add({ value: 'cat' }, 'animal');
ht.Add({ value: 'rat' }, 'animal');
ht.Add({ value: 'dog' }, 'animal');
ht.Add({ value: 'tree' }, 'plant');
ht.Add({ value: 'bushes' }, 'plant');
ht.Add({ value: 'car' }, 'machine');

var expression = Linq.LinqStart(ht);
expression.Where((item) => item.Value == 'animal').Select((item) => item.Key.value).ForEach((item) => console.log(item));