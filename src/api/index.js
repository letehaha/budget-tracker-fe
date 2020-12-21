import * as errors from '@/js/errors';

const methods = Object.freeze({
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
});

const STATUS_CODES = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  timeout: 408,
  conflict: 409,
  internalError: 500,
};

const API_HTTP = process.env.VUE_APP_API_HTTP;
const API_VER = process.env.VUE_APP_API_VER;

/**
 * ApiCaller performs the request to the API
 */
class ApiCaller {
  constructor() {
    this._baseURL = process.env.API_HTTP;
    this.authToken = null;
  }

  setToken(token) {
    this.authToken = token;
  }

  get(endpoint, query, options = {}) {
    return this._call({
      method: methods.GET,
      endpoint,
      options,
      query,
    });
  }

  post(endpoint, data, options = {}) {
    return this._call({
      method: methods.POST,
      endpoint,
      options,
      data,
    });
  }

  patch(endpoint, data, options = {}) {
    return this._call({
      method: methods.PATCH,
      endpoint,
      options,
      data,
    });
  }

  put(endpoint, data, options = {}) {
    return this._call({
      method: methods.PUT,
      endpoint,
      options,
      data,
    });
  }

  delete(endpoint, data, options = {}) {
    return this._call({
      method: methods.DELETE,
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
    const config = {
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

    let response;
    try {
      response = await fetch(url, config);
    } catch (e) {
      throw new Error(e);
    }

    if (response.ok) {
      const result = await response.json();

      return result.response;
    }

    switch (response.status) {
      case STATUS_CODES.unauthorized:
        throw new errors.AuthError(response.statusText, response);
      case STATUS_CODES.internalError:
        throw new errors.NetworkError(response.statusText, response);
      case STATUS_CODES.timeout:
        throw new errors.TimeoutError(response.statusText, response);
      default:
        throw new Error(response.statusText);
    }
  }
}

export const api = new ApiCaller();
