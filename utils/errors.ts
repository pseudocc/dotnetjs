module DotnetJs {

    export class InvalidDataException extends Error {
        constructor(type: string) {
            super('UnExpected data type: ' + type);
        }
    }

    export class FormatException extends Error {
        constructor(msg?: string) {
            super('Format specifier was invalid. ' + msg || '');
        }
    }

    export class NotImplementedExeption extends Error {
        constructor(methodName?: string) {
            super((methodName || 'Method') + ' Not Implemented.');
        }
    }

    export class UnknownExeption extends Error {
        constructor() {
            super('UnknownExeption');
        }
    }

    export class ArgumentException extends Error {
        constructor(msg: string) {
            super('ArgumentException: ' + msg);
        }
    }

    export class ArgumentNullException extends Error {
        constructor(msg: string) {
            super('ArgumentNullException: ' + msg);
        }
    }

    export class ArgumentOutOfRangeException extends Error {
        constructor(msg: string) {
            super('ArgumentOutOfRangeException: ' + msg);
        }
    }

    export class InvalidOperationException extends Error {
        constructor(msg: string) {
            super('InvalidOperationException: ' + msg);
        }
    }
}