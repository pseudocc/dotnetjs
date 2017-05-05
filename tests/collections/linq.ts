import DotnetJs = require('dotnetjs');
var Linq = DotnetJs.Linq;

var array = [31, 56, 63, 33, 66, 99, 52, 1];
var above50 = Linq.Where(array, item => item > 50);
var toArr = above50.ToArray();
export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual(1, Linq.Count(array, item => item === 1));
    assertEqual(2, Linq.IndexOf(array, 63));
    assertEqual(true, Linq.Any(array, item => item === 99));
    assertEqual(false, Linq.Any(array, item => item === 299));
    assertEqual(true, Linq.SequenceEqual([56, 63, 66, 99, 52], above50));
    assertEqual(true, Linq.SequenceEqual(toArr, above50));
    assertEqual(true, Linq.SequenceEqual(Linq.Repeat(0, 5), [0, 0, 0, 0, 0]));
    assertEqual(true, Linq.SequenceEqual(Linq.Concat([23, 42, 44], [11, 33]), [23, 42, 44, 11, 33]));
    var except = Linq.Except([23, 42, 44, 14, 52], [11, 42, 14]);
    assertEqual(true, Linq.SequenceEqual(except, [23, 44, 52]));
    var intersect = Linq.Intersect([23, 52, 21, 65], [54, 21, 52]);
    assertEqual(true, Linq.SequenceEqual(intersect, [52, 21]));
    assertEqual(99, toArr[3]);
    assertEqual(99, above50.ElementAt(3));
    console.log('linq test completed successully.');
    return 0;
}