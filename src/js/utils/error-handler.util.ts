import log from 'loglevel';
import * as errors from '@/js/errors';
import { eventBus } from './event-bus.util';

export class ErrorHandler {
  static process(error: Error, message = ''): void {
    const msgTrId = message || ErrorHandler._getMessage(error);
    eventBus.error(msgTrId);

    ErrorHandler.processWithoutFeedback(error);
  }

  static processWithoutFeedback(error: Error): void {
    log.error(error);
  }

  static _getMessage(error: Error): string {
    let message;

    switch (error.constructor) {
      case errors.NetworkError:
        message = 'Unexpected network error';
        break;
      case errors.TimeoutError:
        message = 'Timeout error';
        break;
      case errors.AuthError:
        message = 'User is not authorized';
        break;
      case errors.TooManyRequestsError:
        message = 'To many requests to the endpoint';
        break;
      default:
        message = 'Unexpected error';
    }

    return message;
  }
}
