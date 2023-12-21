import {createRandomRangeGeneratorNoRepetitions} from '../utils.js';
import {POINT_TYPES, OFFERS} from '../const.js';

const randomOffersCount = createRandomRangeGeneratorNoRepetitions (0, OFFERS.length - 1);
const randomOfferId = createRandomRangeGeneratorNoRepetitions (1, 1000);

const createOfferId = (idTitle, idOffer) => (
  {
    id: `b4c3e4e6-9053-42ce-b747-e281314baa${idOffer}`,
    title: OFFERS[idTitle - 1],
    price: Math.floor(Math.random() * 1000)
  }
);

const generateOfferId = (idTitle) => {
  const idOffer = randomOfferId();
  return createOfferId (idTitle, idOffer);
};

const createOffer = (idPoint) => (
  {
    type: POINT_TYPES[idPoint],
    offers: Array.from({length : randomOffersCount()},(_,index) => generateOfferId(index + 1))
  }
);

const mockOffers = Array.from({length : POINT_TYPES.length - 1},(_,idPoint) => createOffer(idPoint));

export {mockOffers};
