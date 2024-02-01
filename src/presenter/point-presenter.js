import { render, replace, remove } from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';
import { UserAction, UpdateType, Mode } from '../const.js';
import { isMinorUpdate } from '../utils/point.js';

export default class PointPresenter {
  #eventListComponent = null;

  #eventPoint = null;
  #allOffers = null;
  #allDestinations = null;

  #eventPointComponent = null;
  #eventEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor ({eventListComponent, allOffers, allDestinations, onDataChange, onModeChange}) {
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#eventListComponent = eventListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(eventPoint) {
    this.#eventPoint = eventPoint;

    const prevPointComponent = this.#eventPointComponent;
    const prevPointEditComponent = this.#eventEditComponent;

    this.#eventPointComponent = new EventPointView({
      eventPoint: this.#eventPoint,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onEditClick: this.#handleOpenClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventEditComponent = new EditingEventView({
      eventPoint: this.#eventPoint,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onEditClick: this.#handleCloseClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      mode: Mode.EDITING,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#eventPointComponent, this.#eventListComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventPointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING || Mode.ADDITION) {
      replace(this.#eventPointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#eventPointComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#eventPoint);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#eventPoint);
      this.#replaceFormToPoint();
    }
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  }

  #replacePointToForm() {
    replace(this.#eventEditComponent, this.#eventPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#eventPointComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleOpenClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCloseClick = () => {
    this.#eventEditComponent.reset(this.#eventPoint);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#eventPoint, isFavorite: !this.#eventPoint.isFavorite}
    );
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate (update, this.#eventPoint) ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = (eventPoint) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      eventPoint,
    );
  };
}
