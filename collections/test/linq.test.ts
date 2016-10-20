/// <reference path="../hashTable.ts"/>
/// <reference path="../linq.ts"/>
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

console.log('---------------old---------------');
var kvps = Linq.Where(ht, (item) => item.Value == 'animal');
var keyValues = Linq.Select(kvps, (item) => item.Key.value);
Linq.ForEach(keyValues, (item) => console.log(item));

console.log('---------------new---------------');
var expression = new Linq.LinqStart(ht);
expression.Where((item) => item.Value == 'animal').Select((item) => item.Key.value).ForEach((item) => console.log(item));