import AbstractView from '../framework/view/abstract-view.js';

function createNoPointTemplate(massage) {
  return (
    `<p class="trip-events__msg">
      ${massage};
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #massage = null;

  constructor({massage}) {
    super();
    this.#massage = massage;
  }


  get template() {
    return createNoPointTemplate(this.#massage);
  }
}
