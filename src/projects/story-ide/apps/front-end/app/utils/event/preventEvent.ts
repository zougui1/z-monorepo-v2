export const preventEvent = (event: Event): void => {
  event.preventDefault();
  event.stopPropagation();
}

type Event = {
  preventDefault: () => void;
  stopPropagation: () => void;
}
