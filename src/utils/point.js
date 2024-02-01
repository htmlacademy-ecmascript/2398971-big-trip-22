import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MINUTES, DATE_FORMAT } from '../const';

function humanizePointDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function returnDateDuration (dateFrom, dateTo) {
  return dayjs(dateTo).diff(dayjs(dateFrom));
}

function returnDateDurationFormat (dateFrom, dateTo) {
  dayjs.extend(duration);

  const timeDuration = dayjs(dateTo).diff(dayjs(dateFrom));
  const minutesDuration = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes');
  const daysDuration = dayjs(dateTo).diff(dayjs(dateFrom), 'day');

  switch (true) {
    case minutesDuration < MINUTES.oneHour:
      return dayjs.duration(timeDuration).format('mm[M]');
    case minutesDuration >= MINUTES.oneHour && minutesDuration < MINUTES.oneDay:
      return dayjs.duration(timeDuration).format('HH[H] mm[M]');
    case minutesDuration >= MINUTES.oneDay && dayjs.duration(timeDuration).asYears() < 1:
      return dayjs.duration(timeDuration).format('DD[D] HH[H] mm[M]');
    default:
      return `${daysDuration}D ${dayjs.duration(timeDuration).format('HH[H] mm[M]')}`;
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

const sortPointDay = (pointA, pointB) => dayjs(pointB.dateFrom) > dayjs(pointA.dateFrom) ? -1 : 1;
const sortPointTime = (pointA, pointB) => returnDateDuration(pointA.dateFrom, pointA.dateTo) > returnDateDuration(pointB.dateFrom, pointB.dateTo) ? -1 : 1;
const sortPointPrice = (pointA, pointB) => pointA.basePrice > pointB.basePrice ? -1 : 1;

const isMinorUpdate = (updatedPoint, oldPoint) => {
  const isMinor =
  humanizePointDate(updatedPoint.dateFrom,DATE_FORMAT.datMonth) !== humanizePointDate(oldPoint.dateFrom,DATE_FORMAT.datMonth) ||
  returnDateDuration(updatedPoint.dateFrom, updatedPoint.dateTo) !== returnDateDuration(oldPoint.dateFrom, oldPoint.dateTo) ||
  humanizePointDate(updatedPoint.dateFrom, DATE_FORMAT.time) !== humanizePointDate(oldPoint.dateFrom, DATE_FORMAT.time) ||
  humanizePointDate(updatedPoint.dateTo, DATE_FORMAT.time) !== humanizePointDate(oldPoint.dateTo, DATE_FORMAT.time) ||
  updatedPoint.basePrice !== oldPoint.basePrice ||
  updatedPoint.destination !== oldPoint.destination;

  return isMinor;
};

export {
  humanizePointDate,
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
