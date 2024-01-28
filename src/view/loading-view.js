import AbstractView from '../framework/view/abstract-view.js';
import { NoPointMassages } from '../const.js';

function createNoPointTemplate() {
  const noTaskTextValue = NoPointMassages.LOADING;

  return (
    `<p class="trip-events__msg">
      ${noTaskTextValue}
    </p>`
  );
}

export default class LoadingView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
}
