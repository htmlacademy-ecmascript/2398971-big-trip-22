import AbstractView from '../framework/view/abstract-view.js';
import { SortingType } from '../const.js';

function createSortingListTemplate() {

  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${SortingType.DAY}">
      <input id="sort-${SortingType.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortingType.DAY}" checked>
      <label class="trip-sort__btn" for="sort-${SortingType.DAY}">${SortingType.DAY}</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${SortingType.EVENT}">
      <input id="sort-${SortingType.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortingType.EVENT}" disabled>
      <label class="trip-sort__btn" for="sort-${SortingType.EVENT}">${SortingType.EVENT}</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${SortingType.OFFERS}">
      <input id="sort-${SortingType.OFFERS}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortingType.OFFERS}">
      <label class="trip-sort__btn" for="sort-${SortingType.OFFERS}">${SortingType.OFFERS}</label>
    </div>;
    <div class="trip-sort__item  trip-sort__item--${SortingType.PRICE}">
      <input id="sort-${SortingType.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortingType.PRICE}">
      <label class="trip-sort__btn" for="sort-${SortingType.PRICE}">${SortingType.PRICE}</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${SortingType.TIME}">
      <input id="sort-${SortingType.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SortingType.TIME}" disabled>
      <label class="trip-sort__btn" for="sort-${SortingType.TIME}">${SortingType.TIME}</label>
    </div>
  </form>`;
}

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingListTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
