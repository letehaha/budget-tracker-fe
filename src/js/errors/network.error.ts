/**
 * Network error.
 *
 * @class
 */
export class NetworkError extends Error {
  data;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
