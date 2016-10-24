module DotnetJs {

    export interface IDisposable {
        Dispose(): void;
    }

    function GetVersion(): string {
        var Major = 1;
        var Build = 2;
        var Revision = 2;
        
        return Major + '.' + Build + '.' + Revision;
    }

    export function Greetings() {
        var version = GetVersion();
        console.log('DotNetJs -', version, '- https://github.com/Master76/dotnetjs/ -');
    }

}