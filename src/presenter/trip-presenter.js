import { render, RenderPosition } from '../framework/render.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import NoPointView from '../view/no-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from '../presenter/point-presenter.js';
//import EventNewView from '../view/event-new-view.js';

import { NO_POINT_MASSAGES, SortType } from '../const.js';
import { updateItem } from '../utils/common.js';
import { sortPointDay, sortPointTime, sortPointPrice } from '../utils/point.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');

export default class TripPresenter {
  #pointContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #allOffers = null;
  #allDestinations = null;
  #noPointComponent = null;

  #eventListComponent = new EventPointListView();

  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedTripPoints = [];

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
    this.#sourcedTripPoints = [...this.#pointsModel];
  }

  #renderEventPoints({eventPoint, allOffers, allDestinations}) {
    const pointPresenter = new PointPresenter({
      eventListComponent: this.#eventListComponent.element,
      allOffers: allOffers,
      allDestinations:allDestinations,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(eventPoint);
    this.#pointPresenters.set(eventPoint.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsModel = updateItem(this.#pointsModel, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#pointsModel.sort(sortPointDay);
        break;
      case SortType.TIME:
        this.#pointsModel.sort(sortPointTime);
        break;
      case SortType.PRICE:
        this.#pointsModel.sort(sortPointPrice);
        break;
      default:
        this.#pointsModel = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#pointContainer);
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
        allOffers: this.#allOffers,
        allDestinations: this.#allDestinations
      });
    }
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointList () {
    render(this.#eventListComponent, this.#pointContainer);
    this.#renderPoints(0, this.#pointsModel.length);
  }

  #renderPointSection () {

    if (this.#pointsModel.length > 0) {
      this.#renderTripInfo();
      this.#renderSort();
      this.#sortPoints(this.#currentSortType);
      this.#renderPointList();
    }

    if (this.#pointsModel.length <= 0) {
      //console.log('Задач нет');
      this.#renderNoPoints();
    }

  }

}
