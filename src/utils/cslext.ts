/// <reference path="strext.ts" />

interface Console {
    writeLine(format?: string, ...args: any[]);
}

(function () {
    console.writeLine = function (format?: string) {
        if (format == null) {
            console.log();
            return;
        }
        var msg = String.Format.apply(null, arguments);
        console.log(msg);
    }
})();