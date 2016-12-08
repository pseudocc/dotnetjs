import DotnetJs = require('dotnetjs');

var str1 = 'never say never';
var str2 = String.Format('{0} {1} {0}', 'never','say');
var obj1 = {
    name: 'foo',
    code: 223
}
var obj2 = {
    name: 'foo',
    code: 223
}
export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual(str1.GetHashCode(), str2.GetHashCode());
    assertEqual(false, obj1.GetHashCode() === obj2.GetHashCode());
    console.log('hashcode test completed successully.');
    return 0;
}