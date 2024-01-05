import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTaskDueDate } from '../utils/point.js';
import { DATE_FORMAT } from '../const.js';

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

function createHeaderEventDestination (eventPoint, eventDestination, allDestinations) {

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

function createSectionDestination(eventDestination) {

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${eventDestination.description}</p>
    </section>
  `;
}

function createHeaderEditingEventTemplate (eventPoint, allOffers , eventDestination, allDestinations) {

  return `
    <header class="event__header">
      <div class="event__type-wrapper">
        ${createHeaderEventTypeList(eventPoint, allOffers)}
      </div>

      ${createHeaderEventDestination(eventPoint, eventDestination, allDestinations)}

      ${createHeaderEventTime(eventPoint)}

      ${createHeaderEventPrice(eventPoint)}

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>`;
}

function createSectionEditingEventTemplate (eventPoint, eventDestination, allOffers) {

  return `
    <section class="event__details">
      ${createSectionOffers(eventPoint, allOffers)}
      ${createSectionDestination(eventDestination)}
  </section>`;
}

function createEditingEventTemplate({eventPoint, eventDestination, allOffers, allDestinations}) {

  const headerEditingEventTemplate = createHeaderEditingEventTemplate(eventPoint, allOffers, eventDestination, allDestinations);
  const SectionEditingEventTemplate = createSectionEditingEventTemplate(eventPoint, eventDestination, allOffers);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    ${headerEditingEventTemplate}
    ${SectionEditingEventTemplate}
  </form>
</li>`;
}

export default class EditingEventView extends AbstractView {
  #eventPoint = null;
  #eventOffers = null;
  #eventDestination = null;
  #allOffers = null;
  #allDestinations = null;
  #handleEditClick = null;
  #handleFormSubmit = null;

  constructor({eventPoint, eventOffers, eventDestination, allOffers, allDestinations, onEditClick, onFormSubmit}) {
    super();
    this.#eventPoint = eventPoint;
    this.#eventOffers = eventOffers;
    this.#eventDestination = eventDestination;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditingEventTemplate({
      eventPoint: this.#eventPoint,
      eventOffers: this.#eventOffers,
      eventDestination: this.#eventDestination,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations
    });
  }

  #closeEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#eventPoint);
  };
}
