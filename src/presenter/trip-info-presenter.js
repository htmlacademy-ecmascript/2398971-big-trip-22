import {render, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoComponent = null;
  #siteTripMainElement = null;
  #eventPoint = null;
  #allDestinations = null;

  constructor({siteTripMainElement, eventPoint, allDestinations}) {
    this.#siteTripMainElement = siteTripMainElement;
    this.#eventPoint = eventPoint;
    this.#allDestinations = allDestinations;
  }

  init() {

    this.#tripInfoComponent = new TripInfoView({
      eventPoint: this.#eventPoint,
      allDestinations: this.#allDestinations,
    });

    render(this.#tripInfoComponent, this.#siteTripMainElement, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this.#tripInfoComponent === null) {
      return;
    }
    remove(this.#tripInfoComponent);
  }

}
