import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points-mock.js';
import { POINTS__MAX_COUNT } from '../const.js';


export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = Array.from({length: POINTS__MAX_COUNT}, () => getRandomPoint());

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points.map(this.#adaptPointToClient));
    });
  }

  get points() {
    return this.#points;
  }

  updateEventPoint(updateType, update) {
    const index = this.#points.findIndex((eventPoint) => eventPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEventPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deleteEventPoint(updateType, update) {
    const index = this.#points.findIndex((eventPoint) => eventPoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptPointToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

}
