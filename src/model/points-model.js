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
      console.log(points);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
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

}
