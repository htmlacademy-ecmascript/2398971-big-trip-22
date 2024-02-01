import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import NoPointView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import TripInfoPresenter from './trip-info-presenter.js';
import PointPresenter from '../presenter/point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import { SortType, UpdateType, UserAction, FilterType, TimeLimit} from '../const.js';
import { sortPointDay, sortPointTime, sortPointPrice } from '../utils/point.js';
import {filter} from '../utils/filter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');

export default class TripPresenter {
  #pointContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #allOffers = null;
  #allDestinations = null;
  #noPointComponent = null;
  #tripInfoComponent = null;

  #eventListComponent = new EventPointListView();
  #loadingSuccessComponent = new LoadingView({isLoadSuccess: true});
  #loadingFailComponent = new LoadingView({isLoadSuccess: false});

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({pointContainer, pointsModel, offersModel, destinationsModel, filterModel, onNewPointDestroy}) {
    this.#pointContainer = pointContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#allOffers = this.#offersModel.offers;
    this.#allDestinations = this.#destinationsModel.destinations;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#eventListComponent.element,
      allOffers: this.#allOffers,
      allDestinations:this.#allDestinations,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const eventPoints = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](eventPoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointDay);
      case SortType.TIME:
        return filteredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderTrip();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    remove(this.#noPointComponent);
  }

  #renderEventPoints(eventPoint) {
    const pointPresenter = new PointPresenter({
      eventListComponent: this.#eventListComponent.element,
      allOffers: this.#allOffers,
      allDestinations:this.#allDestinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(eventPoint);
    this.#pointPresenters.set(eventPoint.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updateEventPoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addEventPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deleteEventPoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingSuccessComponent);
        this.#renderTrip();
        break;
      case UpdateType.ERROR:
        remove(this.#loadingSuccessComponent);
        this.#renderFailLoading();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#pointContainer);
  }

  renderNoPoints() {
    if (this.points.length <= 0) {

      this.#noPointComponent = new NoPointView({
        filterType: this.#filterType
      });
      render(this.#noPointComponent, this.#pointContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #renderTripInfo() {
    this.#tripInfoComponent = new TripInfoPresenter({
      siteTripMainElement: siteTripMainElement,
      eventPoint: this.#pointsModel.points.sort(sortPointDay),
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
    });
    this.#tripInfoComponent.init();
  }

  #renderPoints(points) {
    points.forEach((eventPoint) => this.#renderEventPoints(eventPoint));
  }

  #renderFailLoading() {
    render(this.#loadingFailComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderSuccessLoading() {
    render(this.#loadingSuccessComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#tripInfoComponent !== null) {
      this.#tripInfoComponent.destroy();
    }

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#loadingFailComponent);
    remove(this.#loadingSuccessComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderTrip () {

    if (this.#pointsModel.points.length > 0) {
      this.#renderTripInfo();
    }

    if (this.points.length > 0) {
      this.#renderSort();

    }

    render(this.#eventListComponent, this.#pointContainer);

    if (this.#isLoading) {
      this.#renderSuccessLoading();
      return;
    }

    if (!this.#isLoading) {
      this.#renderPoints(this.points);
      this.renderNoPoints();
    }
  }
}
