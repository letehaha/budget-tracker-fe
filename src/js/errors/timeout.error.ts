/**
 * Request timeout error.
 *
 * @class
 */
export class TimeoutError extends Error {
  data;

  constructor(message: string, data: unknown) {
    super(message);

    this.data = data;
  }
}
