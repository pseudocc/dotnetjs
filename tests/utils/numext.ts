/// <reference path="../../dist/dotnet.d.ts" />
console.log('--- number extension test ---');

var numbers = [1054.32179, -195489100.8377, 1.0437E21, -1.0573e-0];
var specifiers = ["E", "e", "F", "G", "N", "P"];
runTest([1, 2, 3]);
numbers = [17843, -9232, -1003, 1129];
specifiers = ['D', 'X', 'x'];
runTest([3, 6, 9]);
function runTest(ps: number[]) {
    numbers.forEach(number => {
        console.writeLine("Formatting of {0}:", number);
        specifiers.forEach(specifier => {
            console.writeLine("   {0,-22} {1}", specifier + ":", number.toString(specifier));
            // Add precision specifiers.
            for (var i = 0; i < ps.length; i++) {
                var precision = ps[i];
                var pSpecifier = String.Format("{0}{1}", specifier, precision);
                console.writeLine("   {0,-22} {1}", pSpecifier + ":", number.toString(pSpecifier));
            }
            console.writeLine();
        })
        console.writeLine();
    });
}