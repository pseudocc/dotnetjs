import DotnetJs = require('dotnetjs');

export default function runTest(assertEqual: (expect: Object, result: Object) => void): number {
    assertEqual('never say never', String.Format('{0} {1} {0}', 'never','say'));
    assertEqual('1.0123e+005', String.Format('{0:e4}', 10123));
    assertEqual('0001', '1'.PadLeft(4, '0'));
    assertEqual(true, String.IsNullOrWhiteSpace('  '));
    console.log('string test completed successully.');
    return 0;
}