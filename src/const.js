const DATE_FORMAT = {
  datMonth: 'D MMM',
  monthDat: 'MMM D',
  minute: 'mm',
  month: 'MM',
  day: 'DD',
  time: 'HH:mm',
  date: 'DD HH:mm',
  fullDate: 'DD/MM/YY HH:mm'
};

const MINUTES = {
  oneHour: 60,
  oneDay:1440,
};

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
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
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
  INIT: 'INIT',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDITION: 'ADDITION',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {
  DATE_FORMAT,
  MINUTES,
  NoPointMassages,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  Mode,
  TimeLimit,
};


