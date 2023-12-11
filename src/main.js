import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteFilterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteTripMainElement = siteHeaderElement.querySelector('.trip-main');

const siteEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({pointContainer: siteEventsElement});

render(new TripInfoView(), siteTripMainElement, 'afterbegin');
render(new FilterView(), siteFilterElement);

tripPresenter.init();
