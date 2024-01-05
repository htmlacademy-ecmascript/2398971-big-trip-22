import { render, replace } from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';

export default class PointPresenter {
  #eventListComponent = null;

  #eventPoint = null;
  #eventOffers = null;
  #eventDestination = null;
  #allOffers = null;
  #allDestinations = null;

  #eventPointComponent = null;
  #eventEditComponent = null;

  constructor ({eventListComponent}) {
    this.#eventListComponent = eventListComponent;

  }

  init(eventPoint, eventOffers, eventDestination, allOffers, allDestinations) {
    this.#eventPoint = eventPoint;
    this.#eventOffers = eventOffers;
    this.#eventDestination = eventDestination;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#eventPointComponent = new EventPointView({
      eventPoint: this.#eventPoint,
      eventOffers: this.#eventOffers,
      eventDestination: this.#eventDestination,
      onEditClick: this.#handleOpenClick,
    });

    this.#eventEditComponent = new EditingEventView({
      eventPoint: this.#eventPoint,
      eventOffers: this.#eventOffers,
      eventDestination: this.#eventDestination,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onEditClick: this.#handleCloseClick,
      onFormSubmit: this.#handleFormSubmit,
    });

    render(this.#eventPointComponent, this.#eventListComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#eventEditComponent, this.#eventPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#eventPointComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleOpenClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
