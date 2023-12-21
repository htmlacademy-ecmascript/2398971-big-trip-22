import { mockDestinations } from '../mock/destinations-mock.js';

export default class DestinationsModel {
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }

  getDestinationById (id) {
    const allDestinations = this.getDestinations();

    return allDestinations.find((item)=> item.id === id);
  }
}
