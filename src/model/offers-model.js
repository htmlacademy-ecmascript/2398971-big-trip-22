import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class OffersModel extends Observable{
  #pointsApiService = null;
  #offers = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#pointsApiService.offers;
      this.#offers = offers;
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    }
  }
}
