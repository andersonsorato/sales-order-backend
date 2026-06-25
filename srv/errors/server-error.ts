import { AbstractErro } from './abstract';

export class ServerError extends AbstractErro {
    constructor(stack: string, message = 'internalServerError') {
        super(message, 500, stack);
    }

    public get message(): string {
        return this.message;
    }
}
