import { render, replace, RenderPosition } from '../framework/render.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EventPointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';
import NoPointView from '../view/no-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
//import EventNewView from '../view/event-new-view.js';
import { generateSorting } from '../mock/sorting.js';
import { NO_POINT_MASSAGES } from '../const.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');

export default class TripPresenter {
  #pointContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #allOffers = null;
  #allDestinations = null;
  #sortComponent = null;
  #noPointComponent = null;

  //#sorting = generateSorting(this.#pointsModel);

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

  #renderSort() {
    const sorting = generateSorting(this.#pointsModel);
    this.#noPointComponent = new SortingView({sorting});
    render(this.#noPointComponent, this.#pointContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    const massage = NO_POINT_MASSAGES.everthing;
    this.#sortComponent = new NoPointView({massage});
    render(this.#sortComponent, this.#pointContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTripInfo() {
    render(new TripInfoView(), siteTripMainElement, RenderPosition.AFTERBEGIN);
  }

  #renderPoints(from, to) {
    for (let i = from; i < to; i++) {
      this.#renderEventPoints({
        eventPoint: this.#pointsModel[i],
        eventOffers: this.#offersModel.getOfferById(this.#pointsModel[i].type , this.#pointsModel[i].offers),
        eventDestination: this.#destinationsModel.getDestinationById(this.#pointsModel[i].destination),
        allOffers: this.#allOffers,
        allDestinations: this.#allDestinations
      });
    }
  }

  #renderPointList () {
    render(this.#eventListComponent, this.#pointContainer);
    this.#renderPoints(0, this.#pointsModel.length);
  }

  #renderPointSection () {

    if (this.#pointsModel.length > 0) {
      this.#renderTripInfo();
      this.#renderSort();
      this.#renderPointList();
    }

    if (this.#pointsModel.length <= 0) {
      //console.log('Задач нет');
      this.#renderNoPoints();
    }

  }

}
