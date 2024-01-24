import AbstractView from '../framework/view/abstract-view.js';
import { FilterType, NoPointMassages } from '../const.js';

const NoTasksTextType = {
  [FilterType.EVERYTHING]: NoPointMassages.EVERYTHING,
  [FilterType.PAST]: NoPointMassages.PAST,
  [FilterType.PRESENT]: NoPointMassages.PRESENT,
  [FilterType.FUTURE]: NoPointMassages.FUTURE,
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
