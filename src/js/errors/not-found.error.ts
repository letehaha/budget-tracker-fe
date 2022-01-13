/**
 * Not found error.
 *
 * @class
 */
export class NotFoundError extends Error {
  data;

  constructor(message: string, data: unknown) {
    super(message);

    this.data = data;
  }
}
