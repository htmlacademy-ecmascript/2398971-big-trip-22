import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MILISECONDS } from './const';

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

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

function createRandomRangeGeneratorNoRepetitions (min, max) {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    if (previousValues.length >= (max - min + 1)) {
      return null;
    }
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
}

export {
  getRandomArrayElement,
  getRandomInteger,
  createRandomRangeGeneratorNoRepetitions,
  humanizeTaskDueDate,
  returnDateDuration
};
