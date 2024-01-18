import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeTaskDueDate } from '../utils/point.js';
import { DATE_FORMAT } from '../const.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function createHeaderEventTypeList (eventPoint, allOffers) {

  return `
    <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${eventPoint.type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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

function createHeaderEventDestination (eventPoint, allDestinations) {
  const eventDestination = allDestinations.find((element)=> element.id === eventPoint.destination);

  return `
    <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
      ${eventPoint.type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${eventDestination.name}" list="destination-list-1">
    <datalist id="destination-list-1">
      ${allDestinations.map((destination) => `
      <option value="${destination.name}"></option>`).join('')}
    </datalist>
  </div>`;
}

function createHeaderEventTime (eventPoint) {

  return `
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(eventPoint.dateFrom,DATE_FORMAT.fullDate)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(eventPoint.dateTo,DATE_FORMAT.fullDate)}">
    </div>`;
}

function createHeaderEventPrice (eventPoint) {

  return `
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${eventPoint.basePrice}">
    </div>`;
}

function createSectionOffers (eventPoint, allOffers) {

  const eventOffers = allOffers.find((element)=> element.type === eventPoint.type);

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
      ${eventOffers.offers.map((offers, index) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${index + 1}" type="checkbox" name="${offers.title}" ${(eventPoint.offers.some((item) => item === offers.id)) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-luggage-${index + 1}">
            <span class="event__offer-title">${offers.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offers.price}</span>
          </label>
        </div>`).join('')}
      </div>
    </section>
  `;
}

function createSectionDestination(eventPoint, allDestinations) {
  const eventDestination = allDestinations.find((element)=> element.id === eventPoint.destination);

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventDestination.description}</p>
    </section>
  `;
}

function createHeaderEditingEventTemplate (eventPoint, allOffers, allDestinations) {

  return `
    <header class="event__header">
      <div class="event__type-wrapper">
        ${createHeaderEventTypeList(eventPoint, allOffers)}
      </div>

      ${createHeaderEventDestination(eventPoint, allDestinations)}

      ${createHeaderEventTime(eventPoint)}

      ${createHeaderEventPrice(eventPoint)}

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>`;
}

function createSectionEditingEventTemplate (eventPoint, allOffers, allDestinations) {

  return `
    <section class="event__details">
      ${createSectionOffers(eventPoint, allOffers)}
      ${createSectionDestination(eventPoint, allDestinations)}
  </section>`;
}

function createEditingEventTemplate({eventPoint, allOffers, allDestinations}) {

  const headerEditingEventTemplate = createHeaderEditingEventTemplate(eventPoint, allOffers, allDestinations);
  const SectionEditingEventTemplate = createSectionEditingEventTemplate(eventPoint, allOffers, allDestinations);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    ${headerEditingEventTemplate}
    ${SectionEditingEventTemplate}
  </form>
</li>`;
}

export default class EditingEventView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #handleEditClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepicker = null;

  constructor({eventPoint, allOffers, allDestinations, onEditClick, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(EditingEventView.parsePointToState(eventPoint));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleEditClick = onEditClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditingEventTemplate({
      eventPoint: this._state,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations
    }
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(eventPoint) {
    this.updateElement(
      EditingEventView.parsePointToState(eventPoint),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationToggleHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#eventPriceToggleHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#eventoffersToggleHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);

    this.#setDatepicker();
  }

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditingEventView.parseStateToPoint(this._state));
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#getDestinationById(evt.target.value).id,
    });
  };

  #eventPriceToggleHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #eventoffersToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: this.#getCheckedOfferIdByName(this._state),
    });
  };

  #dateFromChangeHandler = ([date]) => {
    this.updateElement({
      dateFrom: date,
    });
  };

  #dateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date,
    });
  };

  #setDatepicker() {

    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        maxDate: this._state.dateTo,
        enableTime: true,
        'time_24hr': true,
      },
    );

    this.#datepicker = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        minDate: this._state.dateFrom,
        enableTime: true,
        'time_24hr': true,
      },
    );
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditingEventView.parseStateToPoint(this._state));
  };

  static parsePointToState(eventPoint) {
    return {...eventPoint,
      type: eventPoint.type,
      destination: eventPoint.destination,
      basePrice: eventPoint.basePrice,
      offers: eventPoint.offers,
    };
  }

  static parseStateToPoint(state) {

    return {...state};
  }

  #getDestinationById(destinationId) {

    return this.#allDestinations.find((element)=> element.name === destinationId);
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
