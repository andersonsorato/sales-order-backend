export class AbstractErro extends Error {
    public code: number;

    constructor(message: string, erroCode: number, stack: string) {
        super(message);
        this.code = erroCode;
        this.message = message;
        this.stack = stack;
    }
}
