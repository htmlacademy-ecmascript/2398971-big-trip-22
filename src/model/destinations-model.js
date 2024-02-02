import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class DestinationsModel extends Observable {
  #pointsApiService = null;
  #destinations = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#destinations = [];
      this._notify(UpdateType.ERROR);
    }
  }

  getDestinationById (id) {
    const allDestinations = this.destinations;

    return allDestinations.find((item)=> item.id === id);
  }
}
