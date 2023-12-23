import { render, replace } from '../framework/render.js';
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
    this.#renderPointSection();
  }

  #renderEventPoints({eventPoint, eventOffers, eventDestination, allOffers, allDestinations}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventPointComponent = new EventPointView({
      eventPoint,
      eventOffers,
      eventDestination,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditComponent = new EditingEventView({
      eventPoint,
      eventOffers,
      eventDestination,
      allOffers,
      allDestinations,
      onEditClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(eventEditComponent, eventPointComponent);
    }

    function replaceFormToPoint() {
      replace(eventPointComponent, eventEditComponent);
    }

    render(eventPointComponent, this.#eventListComponent.element);
  }

  #renderPointSection () {
    render(new SortingView(), this.#pointContainer);
    render(this.#eventListComponent, this.#pointContainer);

    for (let i = 0; i < this.#pointsModel.length; i++) {
      this.#renderEventPoints({
        eventPoint: this.#pointsModel[i],
        eventOffers: this.#offersModel.getOfferById(this.#pointsModel[i].type , this.#pointsModel[i].offers),
        eventDestination: this.#destinationsModel.getDestinationById(this.#pointsModel[i].destination),
        allOffers: this.#allOffers,
        allDestinations: this.#allDestinations
      });
    }
  }

}
