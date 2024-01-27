import { mockDestinations } from '../mock/destinations-mock.js';

export default class DestinationsModel {
  #pointsApiService = null;
  #destinations = mockDestinations;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.destinations.then((destinations) => {
      console.log(destinations);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById (id) {
    const allDestinations = this.destinations;

    return allDestinations.find((item)=> item.id === id);
  }
}
