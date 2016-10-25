module DotnetJs {

    export interface IDisposable {
        Dispose(): void;
    }

    function GetVersion(): string {
        var Major = 1;
        var Build = 3;
        var Revision = 3;
        
        return Major + '.' + Build + '.' + Revision;
    }

    export function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
    }

}