import { render } from './framework/render.js';
import { generateFilter } from './mock/filter.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');

const siteEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  pointContainer: siteEventsElement,
  pointsModel,
  offersModel,
  destinationsModel
});

const filters = generateFilter(pointsModel.points);


render(new FilterView({filters}), siteFilterElement);

tripPresenter.init();
