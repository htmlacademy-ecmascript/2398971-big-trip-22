import AbstractView from '../framework/view/abstract-view.js';
import { DATE_FORMAT } from '../const.js';
import { humanizeTaskDueDate } from '../utils/point.js';

function createTripInfoTemplate(destinationText, durationText, priceText) {

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinationText}</h1>
        <p class="trip-info__dates">${durationText}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${priceText}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #eventPoint = null;
  #allDestinations = null;
  #allOffers = null;
  #destinationText = null;
  #durationText = null;
  #priceText = null;

  constructor({eventPoint, allOffers, allDestinations}) {
    super();
    this.#eventPoint = eventPoint;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#destinationText = this.#getDestinationText();
    this.#durationText = this.#getDurationText();
    this.#priceText = this.#getPriceText();
  }

  get template() {
    return createTripInfoTemplate(this.#destinationText, this.#durationText, this.#priceText);
  }

  #getDestinationById(destinationId) {
    const destination = this.#allDestinations.find((element) => element.id === destinationId);

    return destination;
  }

  #getDestinationText () {
    const fullDistance = this.#eventPoint.map((element) => this.#getDestinationById(element.destination).name).reverse();
    const distance = [];
    let previousPoint = null;
    let currentPoint = null;

    fullDistance.forEach((point) => {
      currentPoint = point;

      if (currentPoint !== previousPoint) {
        distance.push(currentPoint);
      }

      previousPoint = point;
    });

    const startPoint = fullDistance[0];
    const middlePoints = distance.slice(1,-1);
    const endPoint = fullDistance[fullDistance.length - 1];

    switch (middlePoints.length) {
      case 0:
        return `${startPoint} &mdash; ${endPoint}`;
      case 1:
        return `${startPoint} &mdash; ${middlePoints[0]} &mdash; ${endPoint}`;
      default:
        return `${startPoint} &mdash; ${'...'} &mdash; ${endPoint}`;
    }
  }

  #getDurationText () {
    const dateStart = this.#eventPoint[0].dateFrom;
    const dateEnd = this.#eventPoint[this.#eventPoint.length - 1].dateTo;

    switch (true) {
      case humanizeTaskDueDate(dateStart, DATE_FORMAT.month) === humanizeTaskDueDate(dateEnd, DATE_FORMAT.month) && this.#eventPoint.length !== 1:
        return `${humanizeTaskDueDate(dateStart, DATE_FORMAT.day)}&nbsp;&mdash;&nbsp;${humanizeTaskDueDate(dateEnd, DATE_FORMAT.datMonth)}`;
      default:
        return `${humanizeTaskDueDate(dateStart, DATE_FORMAT.datMonth)}&nbsp;&mdash;&nbsp;${humanizeTaskDueDate(dateEnd, DATE_FORMAT.datMonth)}`;
    }
  }

  #getPriceText () {
    let price = 0;

    this.#eventPoint.forEach((point) => {
      const eventOffers = this.#allOffers.find((element)=> element.type === point.type);
      const eventCheckedOffers = eventOffers.offers.filter((element) => point.offers.find((item) => item === element.id));
      price += eventCheckedOffers.reduce((a, b) => a + Number(b.price), 0);
    });

    price += this.#eventPoint.reduce((a, b) => a + Number(b.basePrice), 0);

    return price;
  }
}
