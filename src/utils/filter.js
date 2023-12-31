import { FilterType } from '../const';
import { isPointFuture,isPointPresent, isPointPast } from '../utils/point.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture (point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent (point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast (point.dateTo))
};

export {filter};
