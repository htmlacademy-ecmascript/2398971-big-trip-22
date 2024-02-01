import AbstractView from '../framework/view/abstract-view.js';
import { NoPointMassages } from '../const.js';

const NoTasksTextType = {
  LOAD_SUCCESS: NoPointMassages.LOADING,
  LOAD_FAILED: NoPointMassages.LOAD_FAIL,
};


function createNoPointTemplate(isLoadSuccess) {

  return (
    `<p class="trip-events__msg">
      ${isLoadSuccess ? NoTasksTextType.LOAD_SUCCESS : NoTasksTextType.LOAD_FAILED}
    </p>`
  );
}

export default class LoadingView extends AbstractView {
  #isLoadSuccess = null;

  constructor({isLoadSuccess}) {
    super();
    this.#isLoadSuccess = isLoadSuccess;
  }


  get template() {
    return createNoPointTemplate(this.#isLoadSuccess);
  }
}
