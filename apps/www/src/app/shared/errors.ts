interface Exception {
    code: number;
    message: string;
}

export const Exception = (function (this: Exception, code: number, message: string) {
    this.code = code;
    this.message = message;
} as unknown) as { new (code: number, message: string): Exception };