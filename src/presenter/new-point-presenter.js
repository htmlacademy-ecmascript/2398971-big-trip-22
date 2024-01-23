import {remove, render, RenderPosition} from '../framework/render.js';
import EditingEventView from '../view/event-editing-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, Mode} from '../const.js';
import dayjs from 'dayjs';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #eventPoint = null;
  #allOffers = null;
  #allDestinations = null;
  #mode = null;

  #pointEditComponent = null;

  constructor({pointListContainer, allOffers, allDestinations, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;

    this.#eventPoint = {
      basePrice: 0,
      dateFrom: dayjs().$d,
      dateTo: dayjs().$d,
      destination: '',
      isFavorite: false,
      offers: [],
      type: 'flight'
    };
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditingEventView({
      eventPoint: this.#eventPoint,
      allOffers: this.#allOffers,
      allDestinations:this.#allDestinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      mode: Mode.ADDITION,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
