import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointDate } from '../utils/point.js';
import { DATE_FORMAT, Mode} from '../const.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function createHeaderEventTypeList (eventPoint, allOffers, isDisabled) {

  return `
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${eventPoint.type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

    <div class="event__type-list">
      <fieldset class="event__type-group">

        <legend class="visually-hidden">Event type</legend>
        ${allOffers.map((offer) => `
        <div class="event__type-item">
          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${(eventPoint.type === offer.type) ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type.replace(offer.type[0], offer.type[0].toUpperCase())}</label>
        </div>`).join('')}

      </fieldset>
    </div>`;
}

function createHeaderEventDestination (eventPoint, allDestinations, isDisabled) {
  const eventDestination = allDestinations.find((element)=> element.id === eventPoint.destination);

  return `
    <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${eventPoint.type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventDestination ? he.encode(eventDestination.name) : ''}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
    <datalist id="destination-list-1">
      ${allDestinations.map((destination) => `
      <option value="${destination.name}"></option>`).join('')}
    </datalist>
  </div>`;
}

function createHeaderEventTime (eventPoint, isDisabled) {

  return `
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDate(eventPoint.dateFrom,DATE_FORMAT.fullDate)}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDate(eventPoint.dateTo,DATE_FORMAT.fullDate)}" ${isDisabled ? 'disabled' : ''}>
    </div>`;
}

function createHeaderEventPrice (eventPoint, isDisabled) {

  return `
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(String(eventPoint.basePrice))}" pattern="[1-9][0-9]*" required ${isDisabled ? 'disabled' : ''}>
    </div>`;
}

function createSectionOffers (eventPoint, eventOffers, isDisabled) {
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${eventOffers.offers.map((offers, index) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="${offers.title}" ${(eventPoint.offers.some((item) => item === offers.id)) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
            <span class="event__offer-title">${offers.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offers.price}</span>
          </label>
        </div>`).join('')}
      </div>
    </section>`;
}

function createSectionDestination(eventDestination) {

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventDestination.description}</p>

      ${eventDestination.pictures.length > 0 ? `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${eventDestination.pictures.map((picture) =>`
          <img class="event__photo" src=${picture.src} alt="Event photo">`).join('')}
        </div>
      </div>` : ''}

    </section>`;
}

function createHeaderEditingEventTemplate (eventPoint, allOffers, allDestinations, mode, isDisabled, isSaving, isDeleting) {
  return `
    <header class="event__header">
      <div class="event__type-wrapper">
        ${createHeaderEventTypeList(eventPoint, allOffers, isDisabled)}
      </div>
        ${createHeaderEventDestination(eventPoint, allDestinations, isDisabled)}
        ${createHeaderEventTime(eventPoint, isDisabled)}
        ${createHeaderEventPrice(eventPoint, isDisabled)}
      <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
      ${mode === Mode.ADDITION ? `<button class="event__reset-btn" type="reset">${isDeleting ? 'Canceling...' : 'Cancel'}</button>` :
    `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>`}
      ${mode === Mode.EDITING ? '<button class="event__rollup-btn" type="button">' : ''}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>`;
}

function createSectionEditingEventTemplate (eventPoint, allOffers, allDestinations, isDisabled) {
  const eventOffers = allOffers.find((element)=> element.type === eventPoint.type);
  const eventDestination = allDestinations.find((element)=> element.id === eventPoint.destination);

  if (eventOffers.offers.length !== 0 || (eventDestination !== undefined && (eventDestination?.description || eventDestination?.pictures.length !== 0))) {
    return `
    <section class="event__details">
      ${eventOffers.offers.length !== 0 ? createSectionOffers(eventPoint, eventOffers, isDisabled) : ''}
      ${(eventDestination?.description || eventDestination?.pictures.length !== 0) && eventPoint.destination ? createSectionDestination(eventDestination) : '' }
    </section>`;
  } else {
    return '';
  }
}

function createEditingEventTemplate({eventPoint, allOffers, allDestinations, mode}) {
  const {isDisabled, isSaving, isDeleting} = eventPoint;

  const headerEditingEventTemplate = createHeaderEditingEventTemplate(eventPoint, allOffers, allDestinations, mode, isDisabled, isSaving, isDeleting);
  const SectionEditingEventTemplate = createSectionEditingEventTemplate(eventPoint, allOffers, allDestinations, isDisabled);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    ${headerEditingEventTemplate}
    ${SectionEditingEventTemplate}
  </form>
</li>`;
}

export default class EventEditingView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #handleEditClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #mode = null;

  constructor({eventPoint, allOffers, allDestinations, onEditClick, onFormSubmit, onDeleteClick, mode}) {
    super();
    this._setState(EventEditingView.parsePointToState(eventPoint));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleEditClick = onEditClick;
    this.#mode = mode;

    this._restoreHandlers();
  }

  get template() {

    return createEditingEventTemplate({
      eventPoint: this._state,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      mode: this.#mode,
    }
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(eventPoint) {
    this.updateElement(
      EventEditingView.parsePointToState(eventPoint),
    );
  }

  _restoreHandlers() {
    const availableOffers = this.element.querySelector('.event__available-offers');

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#inputTypeToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#inputDestinationToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#inputPriceToggleHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    if (availableOffers !== null) {
      availableOffers.addEventListener('change', this.#inputOffersToggleHandler);
    }

    if(this.#mode === Mode.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeButtonEditClickHandler);
    }

    this.#setDatepicker();
  }

  #closeButtonEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditingView.parseStateToPoint(this._state));
  };

  #inputTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #inputDestinationToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#getDestinationById(evt.target.value).id,
    });
  };

  #inputPriceToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #inputOffersToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: this.#getCheckedOfferIdByName(this._state),
    });
  };

  #inputDateFromChangeHandler = ([date]) => {
    this.updateElement({
      dateFrom: date,
    });
  };

  #inputDateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date,
    });
  };

  #setDatepicker() {

    this.#datepickerFrom = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#inputDateFromChangeHandler,
        maxDate: this._state.dateTo,
        enableTime: true,
        'time_24hr': true,
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#inputDateToChangeHandler,
        minDate: this._state.dateFrom,
        enableTime: true,
        'time_24hr': true,
      },
    );
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditingView.parseStateToPoint(this._state));
  };

  static parsePointToState(eventPoint) {

    return {...eventPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  #getDestinationById(destinationId) {
    const destination = this.#allDestinations.find((element)=> element.name === destinationId);

    if (destination === undefined) {
      return '';
    }

    return destination;
  }

  #getOffersByType(type) {

    return this.#allOffers.find((element)=> element.type === type).offers;
  }

  #getCheckedOfferIdByName (eventPoint) {
    const pointOffers = this.#getOffersByType(eventPoint.type);

    return Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((element) => (pointOffers.find((elementId)=> elementId.title === element.name).id));
  }
}
