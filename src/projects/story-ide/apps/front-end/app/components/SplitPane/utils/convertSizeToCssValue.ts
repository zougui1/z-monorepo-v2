import { getUnit } from './getUnit';

export const convertSizeToCssValue = (value: string, resizersSize: any): string => {
  if (getUnit(value) !== '%') {
    return value;
  }

  if (!resizersSize) {
    return value;
  }

  var idx = value.search('%');
  var percent = Number(value.slice(0, idx)) / 100;
  if (percent === 0) {
    return value;
  }

  return 'calc(' + value + ' - ' + resizersSize + 'px*' + percent + ')';
}
