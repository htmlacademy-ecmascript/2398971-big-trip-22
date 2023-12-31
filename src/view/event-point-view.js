import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTaskDueDate, returnDateDurationFormat } from '../utils/point.js';
import { DATE_FORMAT } from '../const.js';

function createSelectedOffersTemplate(selectedOffers) {
  return `
    <ul class="event__selected-offers">
      ${selectedOffers.map((offer) => `
        <li class="event__offer">
          <span class="event__offer-title">${offer.title}</span><br>
            +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
      </li>`).join('')}
    </ul>
`;
}

function createFavoriteTemplate(isFavorite) {
  return `
  <button class="event__favorite-btn ${(isFavorite) ? 'event__favorite-btn--active' : ''}" type="button">
  <span class="visually-hidden">Add to favorite</span>
  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
  </svg>
</button>`;
}

function createEventSchedule (dateFrom, dateTo) {
  return `
  <div class="event__schedule">
  <p class="event__time">
    <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeTaskDueDate(dateFrom,DATE_FORMAT.time)}</time>
    &mdash;
    <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeTaskDueDate(dateTo,DATE_FORMAT.time)}</time>
  </p>
  <p class="event__duration">${returnDateDurationFormat (dateFrom, dateTo)}M</p>
</div>`;
}

function createPointTemplate({point, offers, destination}) {
  const {type, dateFrom, dateTo, isFavorite, basePrice} = point;

  const selectedOffersTemplate = createSelectedOffersTemplate(offers);
  const FavoriteTemplate = createFavoriteTemplate(isFavorite);
  const destinationTemplate = destination.name;
  const datePoint = humanizeTaskDueDate(dateFrom,DATE_FORMAT.datMonth);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${datePoint}</time>

      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>

      <h3 class="event__title">${type} ${destinationTemplate}</h3>

      ${createEventSchedule (dateFrom, dateTo)}

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>

      ${selectedOffersTemplate}
      ${FavoriteTemplate}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>

    </div>
  </li>`;
}

export default class EventPointView extends AbstractView {
  #eventPoint = null;
  #eventOffers = null;
  #eventDestination = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({eventPoint, eventOffers, eventDestination, onEditClick, onFavoriteClick}) {
    super();
    this.#eventPoint = eventPoint;
    this.#eventOffers = eventOffers;
    this.#eventDestination = eventDestination;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEditClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate({
      point: this.#eventPoint,
      offers: this.#eventOffers,
      destination: this.#eventDestination
    });
  }

  #openEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
