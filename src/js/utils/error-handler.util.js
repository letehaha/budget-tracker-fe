import * as errors from '@/js/errors';
import { eventBus } from '@/js/utils';
import log from 'loglevel';

export class ErrorHandler {
  static process(error, translationId = '', errorTrackerConfig = {}) {
    const msgTrId = translationId || ErrorHandler._getTranslationId(error);
    eventBus.error(msgTrId);

    ErrorHandler.processWithoutFeedback(error, errorTrackerConfig);
  }

  static processWithoutFeedback(error) {
    log.error(error);
  }

  static _getTranslationId(error) {
    let translationId;

    switch (error.constructor) {
      case errors.NetworkError:
        translationId = 'Unexpected network error';
        break;
      case errors.TimeoutError:
        translationId = 'Timeout error';
        break;
      case errors.AuthError:
        translationId = 'User is not authorized';
        break;
      default:
        translationId = 'Unexpected error';
    }

    return translationId;
  }
}
