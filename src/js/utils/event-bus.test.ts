import { eventBus, BUS_EVENTS } from './event-bus';

describe('js/utils/event-bus', () => {
  beforeEach(() => {
    eventBus.reset();
  });

  test('listens for emitted events with no passed args', () => {
    const spy = jest.fn();
    const spy2 = jest.fn();

    eventBus.on(BUS_EVENTS.error, spy);
    eventBus.on(BUS_EVENTS.error, spy2);

    eventBus.emit(BUS_EVENTS.error);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(undefined);
    expect(spy2).toHaveBeenCalledWith(undefined);
  });

  test('listens for emitted events with passed args', () => {
    const spy = jest.fn();
    const spy2 = jest.fn();
    const payload = 'test string';

    eventBus.on(BUS_EVENTS.error, spy);
    eventBus.on(BUS_EVENTS.error, spy2);

    eventBus.emit(BUS_EVENTS.error, payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(payload);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(payload);
  });

  test('multiple calls work fine', () => {
    const spy = jest.fn();
    const payload1 = 'test string';
    const payload2 = 'test string 2';

    eventBus.on(BUS_EVENTS.error, spy);

    eventBus.emit(BUS_EVENTS.error);
    eventBus.emit(BUS_EVENTS.error, payload1);
    eventBus.emit(BUS_EVENTS.error, payload2);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, undefined);
    expect(spy).toHaveBeenNthCalledWith(2, payload1);
    expect(spy).toHaveBeenNthCalledWith(3, payload2);
  });

  test('unsubscribe works fine', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    eventBus.on(BUS_EVENTS.error, spy1);
    eventBus.on(BUS_EVENTS.error, spy2);

    eventBus.emit(BUS_EVENTS.error, 'first');

    eventBus.off(BUS_EVENTS.error, spy1);

    eventBus.emit(BUS_EVENTS.error, 'second');

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenNthCalledWith(1, 'first');

    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenNthCalledWith(1, 'first');
    expect(spy2).toHaveBeenNthCalledWith(2, 'second');
  });

  test('reset works correctly', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    eventBus.on(BUS_EVENTS.error, spy1);
    eventBus.on(BUS_EVENTS.error, spy2);

    eventBus.emit(BUS_EVENTS.error, 'first');

    eventBus.off(BUS_EVENTS.error, spy1);
    eventBus.reset();

    eventBus.emit(BUS_EVENTS.error, 'second');

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenNthCalledWith(1, 'first');

    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenNthCalledWith(1, 'first');
  });

  test('"error" event is fired', () => {
    const spy = jest.fn();
    const payload = 'error message';

    eventBus.on(BUS_EVENTS.error, spy);

    eventBus.error(payload);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenNthCalledWith(1, payload);
  });
});
