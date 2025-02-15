import { HttpStatus } from "@nestjs/common";

export class DomainException extends Error {
    public status: HttpStatus;

    constructor(message: string, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}