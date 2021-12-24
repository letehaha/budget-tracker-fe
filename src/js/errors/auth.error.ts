/**
 * Authorization error.
 *
 * @class
 */
export class AuthError extends Error {
  data;

  constructor(message, data) {
    super(message);

    this.data = data;
  }
}
