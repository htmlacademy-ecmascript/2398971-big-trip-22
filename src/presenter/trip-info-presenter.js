import {render, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoComponent = null;
  #siteTripMainElement = null;
  #eventPoints = null;
  #allOffers = null;
  #allDestinations = null;

  constructor({siteTripMainElement, eventPoints, allOffers, allDestinations}) {
    this.#siteTripMainElement = siteTripMainElement;
    this.#eventPoints = eventPoints;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  init() {
    this.#tripInfoComponent = new TripInfoView({
      eventPoints: this.#eventPoints,
      allOffers: this.#allOffers,
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
