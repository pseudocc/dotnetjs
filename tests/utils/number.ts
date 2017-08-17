import DotnetJs = require('dotnetjs');

export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual('3.14', (3.14159265).toString('G2'));
    assertEqual('65521', (65521).toString('G'));
    console.log('number test completed successully.');
    return 0;
}