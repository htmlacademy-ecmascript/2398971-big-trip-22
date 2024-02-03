import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import TripApiService from './trip-api-service.js';

const AUTHORIZATION = 'Basic 6qhV9vVREMsa4yJabIe';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const siteHeaderElement = document.querySelector('.page-header');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteEventsElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');

newPointButtonElement.setAttribute('disabled', 'disabled');

const pointsApiService = new TripApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  pointsApiService: pointsApiService,
});

const offersModel = new OffersModel({
  pointsApiService: pointsApiService,
});

const destinationsModel = new DestinationsModel({
  pointsApiService: pointsApiService,
});

const filterModel = new FilterModel();

await offersModel.init();
await destinationsModel.init();

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
  onNewPointDestroy: closeFormNewPointClickHandle,
});

function closeFormNewPointClickHandle() {
  tripPresenter.renderNoPoints();
  newPointButtonElement.removeAttribute('disabled');
}

function buttonNewPointClickHandle (evt) {
  evt.preventDefault();
  tripPresenter.createPoint();
  newPointButtonElement.setAttribute('disabled', 'disabled');
}

filterPresenter.init();
tripPresenter.init();

await pointsModel.init()
  .finally(() => {
    if (pointsModel.points.length !== 0) {
      newPointButtonElement.removeAttribute('disabled');
    }
    newPointButtonElement.addEventListener('click', buttonNewPointClickHandle);
  });

