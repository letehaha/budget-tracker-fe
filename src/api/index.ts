import { authVuexTypes } from '@/store/auth/types';
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

const STATUS_CODES = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  timeout: 408,
  conflict: 409,
  tooManyRequests: 429,
  internalError: 500,
};

const API_HTTP = process.env.VUE_APP_API_HTTP;
const API_VER = process.env.VUE_APP_API_VER;

/**
 * ApiCaller performs the request to the API
 */
class ApiCaller {
  store;

  router;

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

  get(endpoint: string, query?: string, options = {}) {
    return this._call({
      method: methods.get,
      endpoint,
      options,
      query,
    });
  }

  post(endpoint, data, options = {}) {
    return this._call({
      method: methods.post,
      endpoint,
      options,
      data,
    });
  }

  patch(endpoint, data, options = {}) {
    return this._call({
      method: methods.patch,
      endpoint,
      options,
      data,
    });
  }

  put(endpoint, data, options = {}) {
    return this._call({
      method: methods.put,
      endpoint,
      options,
      data,
    });
  }

  delete(endpoint, data, options = {}) {
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

    const response = await fetch(url, config);

    if (response.ok) {
      const result = await response.json();

      return result.response;
    }

    // TODO: investogate how to return JSON from server
    if (response.status === STATUS_CODES.unauthorized) {
      await this.store.dispatch(`auth/${authVuexTypes.LOG_OUT}`);
      this.router.push('/sign-in');
      throw new errors.AuthError(response.statusText, response);
    }

    const errorPayload = await response.json();

    switch (response.status) {
      case STATUS_CODES.internalError:
        throw new errors.NetworkError(response.statusText, errorPayload);
      case STATUS_CODES.timeout:
        throw new errors.TimeoutError(response.statusText, errorPayload);
      case STATUS_CODES.notFound:
        throw new errors.NotFoundError(response.statusText, errorPayload);
      case STATUS_CODES.tooManyRequests:
        throw new errors.TooManyRequestsError(
          response.statusText,
          errorPayload,
        );
      default:
        throw new Error(response.statusText);
    }
  }

  setStore({ store }) {
    this.store = store;
  }

  setRouter({ router }) {
    this.router = router;
  }
}

export const api = new ApiCaller();

export function initApiCaller({ store, router }) {
  api.setStore({ store });
  api.setRouter({ router });
}