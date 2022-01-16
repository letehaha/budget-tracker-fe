import { ApiBaseError, RESPONSE_STATUS, ERROR_CODES } from 'shared-types';
import { Router } from 'vue-router';
import { CustomStore } from '@/store/types';
import { authVuexTypes } from '@/store/auth/types';

import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import * as errors from '@/js/errors';

enum methods {
  patch = 'PATCH',
  post = 'POST',
  put = 'PUT',
  get = 'GET',
  delete = 'DELETE',
}

interface ApiRequestConfig {
  method: methods,
  headers: {
    'Content-Type': string;
    Authorization: string;
  },
  body?: string,
}

const API_HTTP = process.env.VUE_APP_API_HTTP;
const API_VER = process.env.VUE_APP_API_VER;

// eslint-disable-next-line no-console
console.log('API_HTTP', API_HTTP);
// eslint-disable-next-line no-console
console.log('API_VER', API_VER);
/**
 * ApiCaller performs the request to the API
 */
class ApiCaller {
  store: CustomStore;

  router: Router;

  authToken;

  _baseURL;

  constructor() {
    this._baseURL = process.env.API_HTTP;
    this.authToken = null;
    this.store = null;
    this.router = null;
  }

  setToken(token: string): void {
    this.authToken = token;
  }

  get(endpoint: string, query?: Record<string, unknown>, options = {}) {
    return this._call({
      method: methods.get,
      endpoint,
      options,
      query,
    });
  }

  post(endpoint: string, data, options = {}) {
    return this._call({
      method: methods.post,
      endpoint,
      options,
      data,
    });
  }

  patch(endpoint: string, data, options = {}) {
    return this._call({
      method: methods.patch,
      endpoint,
      options,
      data,
    });
  }

  put(endpoint: string, data, options = {}) {
    return this._call({
      method: methods.put,
      endpoint,
      options,
      data,
    });
  }

  delete(endpoint: string, data = undefined, options = {}) {
    return this._call({
      method: methods.delete,
      endpoint,
      options,
      data,
    });
  }

  /**
   * Performs a request
   *
   * @param {object} opts
   * @param {string} opts.endpoint - endpoint where to make the call to, e.g. `/accounts`
   * @param {object} opts.data - request data (for POST/PUT requests)
   * @param {object} opts.query - request query params. See {@link parseQuery} for details
   * @param {string} opts.method - the http method of request
   * @param {boolean} opts.options.needRaw - defines if raw response should be
   * returned, `true` by default
   * @param {boolean} opts.options.withoutSignature - call API without auth token
   *
   * @private
   */
  async _call(opts) {
    let additionalParams = new URLSearchParams(opts.query).toString();

    if (additionalParams) {
      additionalParams = `?${additionalParams}`;
    }
    const url = `${API_HTTP}${API_VER}${opts.endpoint}${additionalParams}`;
    const config: ApiRequestConfig = {
      method: opts.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      },
    };

    if (opts.data) {
      config.body = JSON.stringify(opts.data);
    }

    if (opts.options?.withoutSignature) {
      delete config.headers.Authorization;
    }

    const result = await fetch(url, config);

    const {
      status,
      response,
    }: {
      status: RESPONSE_STATUS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: ApiBaseError | any,
    } = await result.json();

    if (status === RESPONSE_STATUS.success) {
      return response;
    }

    if (status === RESPONSE_STATUS.error) {
      const { addNotification } = useNotificationCenter();

      if (response.code === ERROR_CODES.unauthorized) {
        await this.store.dispatch(`auth/${authVuexTypes.LOG_OUT}`);

        addNotification({
          id: 'authorization-error',
          text: 'Unauthorized. Please, login first.',
          type: NotificationType.error,
        });

        this.router.push('/sign-in');

        throw new errors.AuthError(
          response.statusText,
          response,
        );
      }

      if (response.code === ERROR_CODES.unexpected) {
        addNotification({
          id: 'unexpected-error',
          text: 'Unexpected error.',
          type: NotificationType.error,
        });
      }

      throw new errors.ApiErrorResponseError(
        response.statusText,
        response,
      );
    }

    return undefined;
  }

  setStore({ store }) {
    this.store = store;
  }

  setRouter({ router }: { router: Router }) {
    this.router = router;
  }
}

export const api = new ApiCaller();

export function initApiCaller(
  { store, router }: { store: CustomStore; router: Router },
): void {
  api.setStore({ store });
  api.setRouter({ router });
}
