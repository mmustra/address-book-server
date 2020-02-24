import { ValidationError } from 'class-validator';
import * as _ from 'lodash';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { ExceptionDto } from '../dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path = request.url;
    const timestamp = new Date().toISOString();
    const statusCode =
      (exception && exception.status) || HttpStatus.INTERNAL_SERVER_ERROR;
    const statusType = HttpStatus[statusCode].replace(/_/g, ' ');

    const message = this.getMessage(exception);

    const error: ExceptionDto = {
      path,
      timestamp,
      statusCode,
      statusType,
      message,
    };

    response.status(statusCode).json(error);
  }

  protected getMessage(exception: any): string {
    let output = '';

    if (!exception) {
      output += 'Unexpected error occurred';
    } else if (_.isString(exception.message)) {
      output += exception.message;
    } else if (_.isArray(exception.message)) {
      _.forEach(
        exception.message,
        message => (output += ` ${this.getMessageDetails(message)}`),
      );
      output = output.substr(1);
    } else if (_.isObjectLike(exception.message)) {
      output += this.getMessage(exception.message);
    }

    return output;
  }

  private getMessageDetails(message: any): string {
    let output = '';

    if (message instanceof ValidationError) {
      let validateMessage = '';
      Object.entries(message.constraints).forEach((constraint): void => {
        const constraintMsg = constraint[1];
        validateMessage += ` ${constraintMsg.charAt(0).toUpperCase() +
          constraintMsg.slice(1)}.`;
      });
      output += validateMessage.substr(1);
    } else if (message instanceof HttpException) {
      output += message.message;
    } else {
      output += message.error ? message.error : JSON.stringify(message);
    }

    return output;
  }
}
