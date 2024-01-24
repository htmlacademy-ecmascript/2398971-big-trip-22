import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

newPointButtonElement.addEventListener('click', handleNewPointButtonClick);

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

function handleNewPointFormClose() {
  tripPresenter.renderNoPoints();
  newPointButtonElement.removeAttribute('disabled');
}

function handleNewPointButtonClick (evt) {
  evt.preventDefault();
  tripPresenter.createPoint();
  newPointButtonElement.setAttribute('disabled', 'disabled');
}

filterPresenter.init();
tripPresenter.init();
