import { getRandomPoint } from '../mock/points-mock.js';
import { POINTS__MAX_COUNT } from '../const.js';


export default class PointsModel {
  points = Array.from({length: POINTS__MAX_COUNT}, () => getRandomPoint());

  getPoints() {
    return this.points;
  }
}
