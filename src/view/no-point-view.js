import AbstractView from '../framework/view/abstract-view.js';
import { FilterType, noPointMassages } from '../const.js';

const NoTasksTextType = {
  [FilterType.EVERYTHING]: noPointMassages.EVERYTHING,
  [FilterType.PAST]: noPointMassages.PAST,
  [FilterType.PRESENT]: noPointMassages.PRESENT,
  [FilterType.FUTURE]: noPointMassages.FUTURE,
};

function createNoPointTemplate(filterType) {
  const noTaskTextValue = NoTasksTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noTaskTextValue}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }


  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
