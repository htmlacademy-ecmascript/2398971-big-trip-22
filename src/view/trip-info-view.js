import AbstractView from '../framework/view/abstract-view.js';
import { DATE_FORMAT } from '../const.js';
import { humanizePointDate } from '../utils/point.js';

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
  #eventPoints = null;
  #allDestinations = null;
  #allOffers = null;
  #destinationText = null;
  #durationText = null;
  #priceText = null;

  constructor({eventPoints, allOffers, allDestinations}) {
    super();
    this.#eventPoints = eventPoints;
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
    const fullDistances = this.#eventPoints.map((element) => this.#getDestinationById(element.destination).name).reverse();
    const distances = [];
    let previousPoint = null;
    let currentPoint = null;

    fullDistances.forEach((point) => {
      currentPoint = point;

      if (currentPoint !== previousPoint) {
        distances.push(currentPoint);
      }

      previousPoint = point;
    });

    const startPoint = fullDistances[0];
    const middlePoints = distances.slice(1,-1);
    const endPoint = fullDistances[fullDistances.length - 1];

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
    const dateStart = this.#eventPoints[0].dateFrom;
    const dateEnd = this.#eventPoints[this.#eventPoints.length - 1].dateTo;

    switch (true) {
      case humanizePointDate(dateStart, DATE_FORMAT.month) === humanizePointDate(dateEnd, DATE_FORMAT.month) && this.#eventPoints.length !== 1:
        return `${humanizePointDate(dateStart, DATE_FORMAT.day)}&nbsp;&mdash;&nbsp;${humanizePointDate(dateEnd, DATE_FORMAT.datMonth)}`;
      default:
        return `${humanizePointDate(dateStart, DATE_FORMAT.datMonth)}&nbsp;&mdash;&nbsp;${humanizePointDate(dateEnd, DATE_FORMAT.datMonth)}`;
    }
  }

  #getPriceText () {
    let price = 0;

    this.#eventPoints.forEach((point) => {
      const eventOffers = this.#allOffers.find((element)=> element.type === point.type);
      const eventCheckedOffers = eventOffers.offers.filter((element) => point.offers.find((item) => item === element.id));
      price += eventCheckedOffers.reduce((a, b) => a + Number(b.price), 0);
    });

    price += this.#eventPoints.reduce((a, b) => a + Number(b.basePrice), 0);

    return price;
  }
}
