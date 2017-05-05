import DotnetJs = require('dotnetjs');
var List = DotnetJs.Collections.List;
var Linq = DotnetJs.Linq;

var l1 = new List<number>();
l1.Add(0);
l1.Add(1);
l1.Add(8);
l1.Add(7);
l1.Add(4);

var l2 = new List<number>([0, 1, 8, 7, 4]);
var l3 = new List<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
l3.RemoveAll(item => item < 5);

export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual(true, Linq.SequenceEqual(l1, l2));
    assertEqual(true, Linq.SequenceEqual(l3, [5, 6, 7, 8, 9]));
    assertEqual(5, l1.Count);
    assertEqual(3, l1.IndexOf(7));
    l1.Remove(7);
    assertEqual(4, l1.Count);
    l1.Clear();
    assertEqual(0, l1.Count);
    console.log('list test completed successully.');
    return 0;
}