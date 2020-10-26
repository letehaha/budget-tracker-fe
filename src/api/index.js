const methods = Object.freeze({
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
  GET: 'GET',
  DELETE: 'DELETE',
});

const API_HTTP = process.env.VUE_APP_API_HTTP;
const API_VER = process.env.VUE_APP_API_VER;

/**
 * ApiCaller performs the request to the API
 */
class ApiCaller {
  constructor() {
    this._baseURL = process.env.API_HTTP;
  }

  get(endpoint, query, needRaw = true) {
    return this._call({
      method: methods.GET,
      endpoint,
      needRaw,
      query,
    });
  }

  post(endpoint, data) {
    return this._call({
      method: methods.POST,
      endpoint,
      data,
    });
  }

  patch(endpoint, data) {
    return this._call({
      method: methods.PATCH,
      endpoint,
      data,
    });
  }

  put(endpoint, data) {
    return this._call({
      method: methods.PUT,
      endpoint,
      data,
    });
  }

  delete(endpoint, data) {
    return this._call({
      method: methods.DELETE,
      endpoint,
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
   * @param {string} opts.needRaw - defines if raw response should be returned, `true` by default
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
        'Content-Type': 'application/json'
      },
    };

    if (opts.data) {
      config.body = JSON.stringify(opts.data);
    }

    let response;

    try {
      const result = await (await fetch(url, config)).json();

      if (opts.needRaw) {
        response = result.response;
      } else {
        response = result;
      }
    } catch (e) {
      throw new Error(e);
    }

    return response;
  }
}

export const api = new ApiCaller();
