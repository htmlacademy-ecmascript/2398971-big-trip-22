import { render } from '../framework/render.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EventPointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';
//import EventNewView from '../view/event-new-view.js';

export default class TripPresenter {
  #pointContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #allOffers = null;
  #allDestinations = null;

  #eventListComponent = new EventPointListView();

  constructor({pointContainer, pointsModel, offersModel, destinationsModel}) {
    this.#pointContainer = pointContainer;
    this.#pointsModel = pointsModel.points;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#allOffers = this.#offersModel.offers;
    this.#allDestinations = this.#destinationsModel.destinations;
  }

  init() {
    render(new SortingView(), this.#pointContainer);
    render(this.#eventListComponent, this.#pointContainer);

    //render(new EventNewView(), this.#eventListComponent.element);

    // render(new EditingEventView({
    //   eventPoint: this.#pointsModel[0],
    //   eventOffers: this.#offersModel.getOfferByType(this.#pointsModel[0].type),
    //   eventDestination: this.#destinationsModel.getDestinationById(this.#pointsModel[0].destination),
    //   allOffers: this.#allOffers,
    //   allDestinations: this.#allDestinations,
    // }),
    // this.#eventListComponent.element);


    for (let i = 0; i < this.#pointsModel.length; i++) {
      this.#renderEventPoint({
        eventPoint: this.#pointsModel[i],
        eventOffers: this.#offersModel.getOfferById(this.#pointsModel[i].type , this.#pointsModel[i].offers),
        eventDestination: this.#destinationsModel.getDestinationById(this.#pointsModel[i].destination),
      });
    }
  }

  #renderEventPoint({eventPoint, eventOffers, eventDestination }) {
    const eventPointComponent = new EventPointView({eventPoint, eventOffers, eventDestination});

    render(eventPointComponent, this.#eventListComponent.element);
  }
}
