import { API_ERROR_CODES, API_RESPONSE_STATUS } from 'shared-types';
import { useAuthStore } from '@/stores';
import { router } from '@/routes';
import { ApiBaseError } from '@/common/types';
import {
  useNotificationCenter,
  NotificationType,
} from '@/components/notification-center';

import * as errors from '@/js/errors';

type HTTP_METHOD = 'PATCH' | 'POST' | 'PUT' | 'GET' | 'DELETE'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiValidResponse = any

interface ApiRequestConfig {
  method: HTTP_METHOD,
  headers: {
    'Content-Type': string;
    Authorization: string;
  },
  body?: string,
}

interface ApiCall {
  endpoint: string;
  method: HTTP_METHOD;
  query?: Record<string, string>;
  data?: Record<string | number, unknown>;
  options?: {
    needRaw?: boolean;
    withoutSignature?: boolean;
  };
}

const API_HTTP = import.meta.env.VITE_APP_API_HTTP;
const API_VER = import.meta.env.VITE_APP_API_VER;

// eslint-disable-next-line no-console
console.log('API_HTTP', API_HTTP);
// eslint-disable-next-line no-console
console.log('API_VER', API_VER);
class ApiCaller {
  authToken: string | null;

  _baseURL: string;

  constructor() {
    this._baseURL = import.meta.env.API_HTTP;
    this.authToken = null;
  }

  setToken(token: string): void {
    this.authToken = token;
  }

  get<T = Record<string, unknown>>(
    endpoint: ApiCall['endpoint'],
    query: T = {} as T,
    options: ApiCall['options'] = {},
  ) {
    const validQuery: ApiCall['query'] = {};

    for (const key in query) {
      if (query[key]) {
        validQuery[key] = query[key]?.toString() ?? '';
      }
    }

    return this._call({
      method: 'GET',
      endpoint,
      options,
      query: validQuery,
    });
  }

  post(
    endpoint: ApiCall['endpoint'],
    data: ApiCall['data'] = undefined,
    options: ApiCall['options'] = {},
  ) {
    return this._call({
      method: 'POST',
      endpoint,
      options,
      data,
    });
  }

  patch(
    endpoint: ApiCall['endpoint'],
    data: ApiCall['data'] = undefined,
    options: ApiCall['options'] = {},
  ) {
    return this._call({
      method: 'PATCH',
      endpoint,
      options,
      data,
    });
  }

  put(
    endpoint: ApiCall['endpoint'],
    data: ApiCall['data'] = undefined,
    options: ApiCall['options'] = {},
  ) {
    return this._call({
      method: 'PUT',
      endpoint,
      options,
      data,
    });
  }

  delete(
    endpoint: ApiCall['endpoint'],
    data: ApiCall['data'] = undefined,
    options: ApiCall['options'] = {},
  ) {
    return this._call({
      method: 'DELETE',
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
  async _call(opts: ApiCall) {
    // TypeScript is dump and things that URLSearchParams only records with string-only
    // values, but it's not
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let additionalParams = new URLSearchParams(opts.query as any).toString();

    if (additionalParams) {
      additionalParams = `?${additionalParams}`;
    }
    const url = `${API_HTTP}${API_VER}${opts.endpoint}${additionalParams}`;
    const config: ApiRequestConfig = {
      method: opts.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authToken || '',
      },
    };

    if (opts.data) {
      config.body = JSON.stringify(opts.data);
    }

    if (opts.options?.withoutSignature) {
      delete config.headers.Authorization;
    }

    let result: Response;

    const { addNotification } = useNotificationCenter();

    try {
      result = await fetch(url, config);
    } catch (e) {
      if (e instanceof TypeError && e.toString().includes('Failed to fetch')) {
        addNotification({
          id: 'api-fetching-error',
          text: 'Failed to fetch data from the server.',
          type: NotificationType.error,
        });

        throw new errors.NetworkError('Failed to fetch data from the server.');
      }

      addNotification({
        id: 'unexpected-api-error',
        text: 'Unexpected error.',
        type: NotificationType.error,
      });

      throw new errors.UnexpectedError('Unexpected error.', {});
    }

    const { status, response }: {
      status: API_RESPONSE_STATUS,
      response: ApiBaseError | ApiValidResponse,
    } = await result.json();

    if (status === API_RESPONSE_STATUS.success) {
      return response;
    }

    if (status === API_RESPONSE_STATUS.error) {
      if (response.code === API_ERROR_CODES.unauthorized) {
        useAuthStore().logout();
        router.push('/');

        addNotification({
          id: 'authorization-error',
          text: 'Unauthorized. Please, login first.',
          type: NotificationType.error,
        });

        throw new errors.AuthError(
          response.statusText,
          response,
        );
      }

      if (response.code === API_ERROR_CODES.unexpected) {
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
}

export const api = new ApiCaller();
