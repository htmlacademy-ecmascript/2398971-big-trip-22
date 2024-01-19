import { getRandomInteger, createRandomRangeGeneratorNoRepetitions, getRandomArrayElement} from '../utils/common.js';
import { mockDestinations } from '../mock/destinations-mock.js';
import { mockOffers } from '../mock/offers-mock.js';
import { POINT_MAX_PRICE, POINTS__MAX_COUNT, DURATIONS } from '../const.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const randomSelectedOffers = (idOffer) => {
  const randomOfferType = mockOffers[idOffer].offers;
  const randomOffer = createRandomRangeGeneratorNoRepetitions(0, randomOfferType.length - 1);
  const selectedOffers = Array.from({length : getRandomInteger (0, randomOfferType.length)}, () => (randomOfferType[randomOffer()].id));

  return selectedOffers;
};

function getRandomDate (dateFrom) {

  const randomMinute = DURATIONS.minute[getRandomInteger(0, 2)];
  const randomHour = DURATIONS.hour[getRandomInteger(0, 2)];
  const randomDay = DURATIONS.day[getRandomInteger(0, 2)];

  const dateTo = dayjs(dateFrom)
    .add(randomMinute, 'minute')
    .add(randomHour, 'hour')
    .add(randomDay, 'day')
    .toDate();

  return dateTo;
}


function generateRandomDateInterval () {
  const dateNow = dayjs().add(-5, 'day');
  const previousDates = [dateNow.$d];

  return function () {
    const currentDate = getRandomDate (previousDates[previousDates.length - 1]);
    previousDates.push(currentDate);

    return {
      dateFrom: previousDates[previousDates.length - 2],
      dateTo: currentDate
    };
  };
}

const dateMocks = generateRandomDateInterval();

const createPoint = (idOffer) => {
  const randomDate = dateMocks();

  return {
    basePrice: Math.floor(Math.random() * POINT_MAX_PRICE),
    dateFrom: randomDate.dateFrom,
    dateTo: randomDate.dateTo,
    destination: mockDestinations[getRandomInteger (0, mockDestinations.length - 1)].id,
    isFavorite: Boolean(getRandomInteger (0, 1)),
    offers: randomSelectedOffers(idOffer),
    type: mockOffers[idOffer].type
  };
};

const generatePoint = () => {
  const randomPointId = getRandomInteger (0, mockOffers.length - 1);

  return createPoint(randomPointId);
};

const pointsMock = Array.from({length : POINTS__MAX_COUNT},() => generatePoint());

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(pointsMock)
  };
}

export {getRandomPoint};
