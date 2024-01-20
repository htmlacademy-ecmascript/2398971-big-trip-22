import { getRandomInteger } from '../utils/common.js';
import { DESCRIPTIONS, DESTINATIONS, PICTURE_MAX } from '../const.js';

const createDestinationUrl = (id) => (
  {
    src: `https://loremflickr.com/248/152?random=${id}`,
    description: DESCRIPTIONS[getRandomInteger (0, DESCRIPTIONS.length - 1)]
  }
);

const createDestination = (id) => (
  {
    id: `bfa5cb75-a1fe-4b77-a83c-0e528e910e${id}`,
    description: DESCRIPTIONS[getRandomInteger (0, DESCRIPTIONS.length - 1)],
    name: DESTINATIONS[id - 1],
    pictures: Array.from({length : Math.floor(Math.random() * PICTURE_MAX)},(_,index) => createDestinationUrl(index + 1))
  }
);

const mockDestinations = Array.from({length : DESTINATIONS.length},(_,index) => createDestination(index + 1));

export {mockDestinations};
