import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MILISECONDS } from '../const';

function humanizeTaskDueDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function returnDateDuration (dateFrom, dateTo) {
  dayjs.extend(duration);

  const timeDuration = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDuration < MILISECONDS.oneHour) {
    return dayjs.duration(timeDuration).format('mm[M]');
  } else {
    if (timeDuration >= MILISECONDS.oneHour && timeDuration < MILISECONDS.oneDay) {
      return dayjs.duration(timeDuration).format('HH[H] mm[M]');
    } else {
      return dayjs.duration(timeDuration).format('DD[D] HH[H] mm[M]');
    }
  }
}

export {
  humanizeTaskDueDate,
  returnDateDuration
};
