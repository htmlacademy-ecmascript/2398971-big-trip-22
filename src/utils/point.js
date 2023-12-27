import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import moment from 'moment';
import { MILISECONDS } from '../const';

function humanizeTaskDueDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function returnDateDuration (dateFrom, dateTo) {
  return dayjs(dateTo).diff(dayjs(dateFrom));
}

function returnDateDurationFormat (dateFrom, dateTo) {
  dayjs.extend(duration);

  const timeDuration = returnDateDuration (dateFrom, dateTo);

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

function isPointFuture(dateFrom) {
  moment().format();

  return dayjs().isBefore(dateFrom, 'day');
}

function isPointPresent(dateFrom, dateTo) {
  moment().format();

  return !isPointFuture(dateFrom) && !isPointPast(dateTo);
}

function isPointPast(dateTo) {
  moment().format();

  return dayjs().isAfter(dateTo, 'day');
}

export {
  humanizeTaskDueDate,
  returnDateDuration,
  returnDateDurationFormat,
  isPointFuture,
  isPointPresent,
  isPointPast
};
