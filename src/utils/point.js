import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MILISECONDS, DATE_FORMAT } from '../const';

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

  return dayjs().isBefore(dateFrom, 'day');
}

function isPointPresent(dateFrom, dateTo) {

  return !isPointFuture(dateFrom) && !isPointPast(dateTo);
}

function isPointPast(dateTo) {

  return dayjs().isAfter(dateTo, 'day');
}


const sortPointDay = (pointA, pointB) => dayjs(pointA.dateFrom) > dayjs(pointB.dateFrom) ? -1 : 1;
const sortPointTime = (pointA, pointB) => returnDateDuration(pointA.dateFrom, pointA.dateTo) > returnDateDuration(pointB.dateFrom, pointB.dateTo) ? -1 : 1;
const sortPointPrice = (pointA, pointB) => pointA.basePrice > pointB.basePrice ? -1 : 1;

const isMinorUpdate = (updatedPoint, oldPoint) => {
  const isMinor =
  humanizeTaskDueDate(updatedPoint.dateFrom,DATE_FORMAT.datMonth) !== humanizeTaskDueDate(oldPoint.dateFrom,DATE_FORMAT.datMonth) ||
  returnDateDuration(updatedPoint.dateFrom, updatedPoint.dateTo) !== returnDateDuration(oldPoint.dateFrom, oldPoint.dateTo) ||
  humanizeTaskDueDate(updatedPoint.dateFrom, DATE_FORMAT.time) !== humanizeTaskDueDate(oldPoint.dateFrom, DATE_FORMAT.time) ||
  humanizeTaskDueDate(updatedPoint.dateTo, DATE_FORMAT.time) !== humanizeTaskDueDate(oldPoint.dateTo, DATE_FORMAT.time) ||
  updatedPoint.basePrice !== oldPoint.basePrice;

  return isMinor;
};

export {
  humanizeTaskDueDate,
  returnDateDuration,
  returnDateDurationFormat,
  isPointFuture,
  isPointPresent,
  isPointPast,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
  isMinorUpdate,
};
