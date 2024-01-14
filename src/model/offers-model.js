import { mockOffers } from '../mock/offers-mock.js';

export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }
}
