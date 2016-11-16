"use strict";
/// <reference path="../../dist/dotnet.d.ts" />
var DotnetJs = require('dotnetjs');
// import DotnetJs = require('../../dist/dotnet.js');
var char = DotnetJs.Char;
function runTest(assertEqual) {
    assertEqual(false, char.IsUpper('Foo', 1));
    assertEqual(true, char.IsPunctuation(','));
    assertEqual(true, char.IsControl('\r'));
    assertEqual(true, char.IsDigit('7'));
    assertEqual(true, char.IsLetter('bar', 2));
    console.log('char test completed successully.');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runTest;
//# sourceMappingURL=char.js.map