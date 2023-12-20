import { mockOffers } from '../mock/offers-mock.js';

export default class OffersModel {
  offers = mockOffers;

  getOffers() {
    return this.offers;
  }

  getOfferByType(type) {
    const allOffers = this.getOffers();

    return allOffers.find((element)=> element.type === type);
  }

  getOfferById (type, itemsId) {
    const offerType = this.getOfferByType(type);
    return offerType.offers.filter((item) => itemsId.find((id) => item.id === id));
  }
}
