import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  filterModel,
  pointsModel
});

const tripPresenter = new TripPresenter({
  pointContainer: siteEventsElement,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  tripPresenter.renderNoPoints();
  newPointButtonComponent.template.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.template.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
