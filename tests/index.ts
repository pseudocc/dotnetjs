/// <reference path="../typings/node.d.ts" />

import assert = require('assert');
import charTest from './utils/char';
import stringTest from './utils/string';
import listTest from './collections/list';
import linqTest from './collections/linq';
import hashTest from './utils/hashcode';

var testCases: ((Function) => number)[] = [
    charTest, stringTest, listTest, linqTest, hashTest
];
var passed = 0;
for (var i = 0; i < testCases.length; i++) {
    let ut = testCases[i];
    try {
        let code = ut(asserEqual);
        if (code == 0)
            passed++;
    }
    catch (e) {
        var exception = <Error>e;
        console.warn(exception.stack);
    }
}
console.writeLine("{0} of {1} test cases passed.", passed, testCases.length);

process.exit(0);

function asserEqual(expected: Object, actual: Object) {
    if (!actual.Equals(expected)) {
        var msg = String.Format('{0} was expected, but got {1} instead.', expected, actual);
        assert.fail(actual, expected, msg, 'Object.Equals(Object)');
    }
}