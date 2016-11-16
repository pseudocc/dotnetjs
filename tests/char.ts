/// <reference path="../dist/dotnet.d.ts" />
import DotnetJs = require('dotnetjs');
// import DotnetJs = require('../dist/dotnet.js');
var char = DotnetJs.Char;

export default function runTest(assertEqual: (expect: Object, result: Object) => void) {
    assertEqual(false, char.IsUpper('Foo', 1));
    assertEqual(true, char.IsPunctuation(','));
    assertEqual(true, char.IsControl('\r'));
    assertEqual(true, char.IsDigit('7'));
    assertEqual(true, char.IsLetter('bar', 2));
    console.log('char test completed successully.');
}
