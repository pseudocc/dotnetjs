module DotnetJs {

    export class NotImplementedExeption extends Error {
        constructor(msg: string) {
            super('NotImplementedExeption: ' + msg);
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