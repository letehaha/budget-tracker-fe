/**
 * Network error.
 *
 * @class
 */
export class NetworkError extends Error {
  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
