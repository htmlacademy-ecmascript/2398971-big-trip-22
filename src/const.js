const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS = ['Amsterdam', 'Geneva', 'Chamonix', 'Berlin', 'Paris', 'London'];
const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Travel by train', 'Service 1', 'Service 2','Service 3','Service 4','Service 5','Service 6','Service 7','Service 8',];
const DESCRIPTIONS = [
  '',
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
  month: 'MM',
  day: 'DD',
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

const NoPointMassages = {
  LOAD_FAIL: 'Failed to load latest route information',
  LOADING: 'Loading...',
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDITION: 'ADDITION',
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
  NoPointMassages,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  Mode,
};


