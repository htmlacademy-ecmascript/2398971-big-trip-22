import { mockOffers } from '../mock/offers-mock.js';

export default class OffersModel {
  #pointsApiService = null;
  #offers = mockOffers;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.offers.then((offers) => {
      console.log(offers);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  get offers() {
    return this.#offers;
  }
}
