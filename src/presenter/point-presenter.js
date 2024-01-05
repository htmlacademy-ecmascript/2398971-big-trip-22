import { render, replace, remove } from '../framework/render.js';
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

    const prevPointComponent = this.#eventPointComponent;
    const prevPointEditComponent = this.#eventEditComponent;

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

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#eventPointComponent, this.#eventListComponent);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#eventListComponent.contains(prevPointComponent.element)) {
      replace(this.#eventPointComponent, prevPointComponent);
    }

    if (this.#eventListComponent.contains(prevPointEditComponent.element)) {
      replace(this.#eventEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#eventPointComponent);
    remove(this.#eventEditComponent);
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
