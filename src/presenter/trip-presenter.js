import { render, RenderPosition } from '../framework/render.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import NoPointView from '../view/no-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import PointPresenter from '../presenter/point-presenter.js';
//import EventNewView from '../view/event-new-view.js';

import { NO_POINT_MASSAGES, SortType, UpdateType, UserAction} from '../const.js';
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

  constructor({pointContainer, pointsModel, offersModel, destinationsModel}) {
    this.#pointContainer = pointContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#allOffers = this.#offersModel.offers;
    this.#allDestinations = this.#destinationsModel.destinations;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortPointDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortPointTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPointPrice);
    }

    return this.#pointsModel.points;
  }

  init() {
    this.#renderPointSection();
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
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updateEventPoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addEventPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deleteEventPoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось содержание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда точка удалена)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
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

  #renderPoints(points) {
    points.forEach((eventPoint) => this.#renderEventPoints(eventPoint));
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderPointList () {
    render(this.#eventListComponent, this.#pointContainer);
    this.#renderPoints(this.points);
  }

  #renderPointSection () {

    if (this.points.length > 0) {
      this.#renderTripInfo();
      this.#renderSort();
      this.#renderPointList();
    }

    if (this.points.length <= 0) {
      //console.log('Задач нет');
      this.#renderNoPoints();
    }

  }

}
