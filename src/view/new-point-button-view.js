import AbstractView from '../framework/view/abstract-view.js';

export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return document.querySelector('.trip-main__event-add-btn');
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
