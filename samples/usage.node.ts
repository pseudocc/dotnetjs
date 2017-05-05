import * as DotnetJs from 'dotnetjs';

var HashTable = DotnetJs.Collections.Dictionary;
var Linq = DotnetJs.Linq;

type LocalKey = {
    value: string;
}

var ht = new HashTable<LocalKey, string>();
var key_cat = { value: 'cat' };
ht.Add(key_cat, 'animal');
ht.Add({ value: 'rat' }, 'animal');
ht.Add({ value: 'dog' }, 'animal');
ht.Add({ value: 'tree' }, 'plant');
ht.Add({ value: 'bushes' }, 'plant');
ht.Add({ value: 'car' }, 'machine');

var type;
if (ht.TryGetValue(key_cat, out => type = out))
    console.log(type);

var expression = Linq.LinqStart(ht);
expression.Where((item) => item.Value == 'animal').Select((item) => item.Key.value).ForEach((item) => console.log(item));