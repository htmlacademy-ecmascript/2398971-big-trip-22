import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points-mock.js';
import { POINTS__MAX_COUNT } from '../const.js';


export default class PointsModel extends Observable {
  #points = Array.from({length: POINTS__MAX_COUNT}, () => getRandomPoint());

  get points() {
    return this.#points;
  }
}
