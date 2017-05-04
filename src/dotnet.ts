/// <reference path="utils/prim.ts" />

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