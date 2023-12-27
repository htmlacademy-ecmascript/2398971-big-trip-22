const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS = ['Amsterdam', 'Geneva', 'Chamonix', 'Berlin', 'Paris', 'London'];
const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Travel by train', 'Service 1', 'Service 2','Service 3','Service 4','Service 5','Service 6','Service 7','Service 8',];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  ' Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const DATE_FORMAT = {
  datMonth: 'D MMM',
  minute: 'mm',
  time: 'HH:mm',
  date: 'DD HH:mm',
  fullDate: 'DD/MM/YY HH:mm'
};

const DURATIONS = {
  minute: [0, 30, 50],
  hour: [0, 1, 2],
  day: [0, 1, 2],
};

const MILISECONDS = {
  oneHour: 3600000,
  oneDay:86400000
};

const POINT_MAX_PRICE = 1000;
const POINTS__MAX_COUNT = 10;
const PICTURE_MAX = 5;

const NO_POINT_MASSAGES = {
  loadFail: 'Failed to load latest route information',
  loading: 'Loading...',
  everthing: 'Click New Event to create your first point',
  past: 'There are no past events now',
  present: 'There are no present events now',
  future: 'There are no future events now'
};

const FilterType = {
  EVERYTHING: 'everthing',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export {
  POINT_TYPES,
  DESTINATIONS,
  OFFERS,
  DESCRIPTIONS,
  DATE_FORMAT,
  DURATIONS,
  MILISECONDS,
  POINT_MAX_PRICE,
  POINTS__MAX_COUNT,
  PICTURE_MAX,
  NO_POINT_MASSAGES,
  FilterType,
  SortingType
};


