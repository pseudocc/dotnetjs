/// <reference path="typings/node.d.ts" />
try {
    module.exports = DotnetJs;
}
catch (e) {
    
}
finally {
    DotnetJs.Greetings();
}

declare module 'dotnetjs' {
    import dotnetjs = DotnetJs;
    export = dotnetjs;
}