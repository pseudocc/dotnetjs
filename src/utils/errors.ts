module DotnetJs {

    export class InvalidDataException extends Error {
        constructor(type: string) {
            super('Unexpected data type: ' + type);
            this.stack = (new Error()).stack;
            this.name = 'InvalidDataException';
        }
    }

    export class FormatException extends Error {
        constructor(msg?: string) {
            super('Format specifier was invalid. ' + msg || '');
            this.stack = (new Error()).stack;
            this.name = 'InvalidDataException';
        }
    }

    export class NotImplementedExeption extends Error {
        constructor(methodName?: string) {
            super((methodName || 'Method') + ' Not Implemented.');
            this.stack = (new Error()).stack;
            this.name = 'InvalidDataException';
        }
    }

    export class UnknownExeption extends Error {
        constructor() {
            super('An unknown exeption occured. Please send the stack trace to me. Thank you.');
            this.stack = (new Error()).stack;
            this.name = 'UnknownExeption';
        }
    }

    export class ArgumentException extends Error {
        constructor(msg: string) {
            super('An argument exception occured: ' + msg);
            this.stack = (new Error()).stack;
            this.name = 'ArgumentException';
        }
    }

    export class ArgumentNullException extends Error {
        constructor(msg: string) {
            super('Argument with parameter name ' + msg + ' is null or undefined.');
            this.stack = (new Error()).stack;
            this.name = 'ArgumentNullException';
        }
    }

    export class ArgumentOutOfRangeException extends Error {
        constructor(msg: string) {
            super('Argument given was out of range: ' + msg);
            this.stack = (new Error()).stack;
            this.name = 'ArgumentOutOfRangeException';
        }
    }

    export class InvalidOperationException extends Error {
        constructor(msg: string) {
            super('Operation is invalid: ' + msg);
            this.stack = (new Error()).stack;
            this.name = 'InvalidOperationException';
        }
    }
}