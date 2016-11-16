/// <reference path="../typings/node.d.ts" />
"use strict";
var assert = require('assert');
var char_1 = require('./utils/char');
try {
    char_1.default(asserEqual);
}
catch (e) {
    var exception = e;
    console.warn(exception.stack);
    process.exit(1);
}
finally {
    process.exit(0);
}
function asserEqual(expected, actual) {
    if (!actual.Equals(expected)) {
        var msg = String.Format('{0} was expected, but got {1} instead.', expected, actual);
        assert.fail(actual, expected, msg, 'Object.Equals(Object)');
    }
}
//# sourceMappingURL=index.js.map