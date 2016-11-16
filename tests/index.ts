/// <reference path="../typings/node.d.ts" />

import assert = require('assert');
import charTest from './utils/char';
try {
    charTest(asserEqual);
}
catch (e) {
    var exception = <Error>e;
    console.warn(exception.stack);
    process.exit(1);
}
finally {
    process.exit(0);
}

function asserEqual(expected: Object, actual: Object) {
    if (!actual.Equals(expected)) {
        var msg = String.Format('{0} was expected, but got {1} instead.', expected, actual);
        assert.fail(actual, expected, msg, 'Object.Equals(Object)');
    }
}