import * as DotnetJs from 'dotnetjs';

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

var expression = new Linq.LinqStart(ht);