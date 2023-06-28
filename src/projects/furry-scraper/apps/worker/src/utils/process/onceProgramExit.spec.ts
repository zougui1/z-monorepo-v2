import { EventEmitter } from 'node:events';

import { onceProgramExit, ExitSignal } from './onceProgramExit';

describe('onceProgramExit', () => {
  const shutdownSignals: ExitSignal[] = [
    'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each(shutdownSignals)('should listen for the signal %p once', signal => {
    const listener = jest.fn();

    const emitter = new EventEmitter();
    // @ts-ignore emitter.once doesn't have the same signature as process.once
    jest.spyOn(process, 'once').mockImplementation(emitter.once.bind(emitter));

    onceProgramExit(listener);

    emitter.emit(signal);

    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith(signal);

    emitter.removeAllListeners();
  });

  test.each(shutdownSignals)('should no longer listen for the signal %p when the cleanup function has been called', signal => {
    const listener = jest.fn();

    const emitter = new EventEmitter();
    // @ts-ignore emitter.once doesn't have the same signature as process.once
    jest.spyOn(process, 'once').mockImplementation(emitter.once.bind(emitter));
    // @ts-ignore emitter.off doesn't have the same signature as process.off
    jest.spyOn(process, 'off').mockImplementation(emitter.off.bind(emitter));

    const cleanup = onceProgramExit(listener);
    cleanup();

    emitter.emit(signal);

    expect(listener).not.toBeCalled();
  });
});
