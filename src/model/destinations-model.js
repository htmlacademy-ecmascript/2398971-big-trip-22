import { mockDestinations } from '../mock/destinations-mock.js';

export default class DestinationsModel {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }

  getDestinationById (id) {
    const allDestinations = this.destinations;

    return allDestinations.find((item)=> item.id === id);
  }
}
