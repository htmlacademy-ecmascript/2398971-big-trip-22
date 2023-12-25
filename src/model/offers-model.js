import { mockOffers } from '../mock/offers-mock.js';

export default class OffersModel {
  #offers = mockOffers;

  get offers() {
    return this.#offers;
  }

  getOfferByType(type) {
    const allOffers = this.offers;

    return allOffers.find((element)=> element.type === type);
  }

  getOfferById (type, itemsId) {
    const offerType = this.getOfferByType(type);
    return offerType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
