export const forkEventHandler = <E extends React.SyntheticEvent, Args extends unknown[]>(...closeHandlers: (((event: E, ...args: Args) => void) | undefined)[]) => {
  return (event: E, ...args: Args) => {
    for (const closeHandler of closeHandlers) {
      closeHandler?.(event, ...args);

      if (event.defaultPrevented) {
        return;
      }
    }
  }
}
