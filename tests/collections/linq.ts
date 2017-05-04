import DotnetJs = require('dotnetjs');
var Linq = DotnetJs.Linq;

var array = [31, 56, 63, 33, 66, 99, 52, 1];
var above50 = Linq.Where(array, item => item > 50);
var toArr = above50.ToArray();
export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual(true, Linq.SequenceEqual([56, 63, 66, 99, 52], above50));
    assertEqual(true, Linq.SequenceEqual(toArr, above50));
    assertEqual(true, Linq.SequenceEqual(Linq.Repeat(0, 5), [0, 0, 0, 0, 0]));
    assertEqual(Linq.Concat([23, 42, 44], [11, 33]).ToArray(), [23, 42, 44, 11, 33]);
    assertEqual(Linq.Except([23, 42, 44, 14, 52], [11, 42, 14]).ToArray(), [23, 44, 52]);
    assertEqual(99, toArr[3]);
    assertEqual(99, above50.ElementAt(3));
    console.log('linq test completed successully.');
    return 0;
}