import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        const status = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception.message || "Internal Server Error";

        response.status(status).json({
            status,
            timestamp: new Date().toLocaleString(),
            path: request.url,
            errors: [message]
        });
    }
}