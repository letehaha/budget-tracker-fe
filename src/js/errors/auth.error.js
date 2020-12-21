/**
 * Authorization error.
 *
 * @class
 */
export class AuthError extends Error {
  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
