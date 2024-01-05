import AbstractView from '../framework/view/abstract-view.js';

function createSortingItemTemplate (sorting, isChecked) {
  const {type, disable} = sorting;

  return `
  <div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isChecked ? 'checked' : ''} ${disable ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${type}">${type}</label>
  </div>`;
}

function createSortingListTemplate(sortingItems) {
  const sortingItemsTemplate = sortingItems
    .map((sorting, index) => createSortingItemTemplate(sorting, index === 0))
    .join('');

  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortingItemsTemplate}
  </form>`;
}

export default class SortingView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

  //   Array.from(
  //     {length : this.element.querySelectorAll('.trip-sort__input').length},
  //     (_,index) => this.element.querySelectorAll('.trip-sort__input')[index].addEventListener('change', this.#sortTypeChangeHandler));
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortingListTemplate(this.#handleSortTypeChange);
  }

  // #switchSorting = (evt) => {
  //   evt.preventDefault();
  //   // eslint-disable-next-line no-console
  //   console.log(evt.target);

  // };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };

}
