import {render} from '../render.js';
import EventPointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EventPointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';
//import EventNewView from '../view/event-new-view.js';

export default class TripPresenter {
  eventListComponent = new EventPointListView();

  constructor({pointContainer, pointsModel, offersModel, destinationsModel}) {
    this.pointContainer = pointContainer;
    this.pointsModel = pointsModel.getPoints();
    this.offersModel = offersModel;
    this.destinationsModel = destinationsModel;
    this.allOffers = this.offersModel.getOffers();
    this.allDestinations = this.destinationsModel.getDestinations();
  }

  init() {
    render(new SortingView(), this.pointContainer);
    render(this.eventListComponent, this.pointContainer);

    //render(new EventNewView(), this.eventListComponent.getElement());

    render(new EditingEventView({
      eventPoint: this.pointsModel[0],
      eventOffers: this.offersModel.getOfferByType(this.pointsModel[0].type),
      eventDestination: this.destinationsModel.getDestinationById(this.pointsModel[0].destination),
      allOffers: this.allOffers,
      allDestinations: this.allDestinations,
    }),
    this.eventListComponent.getElement());


    for (let i = 1; i < this.pointsModel.length; i++) {
      render(new EventPointView({
        eventPoint: this.pointsModel[i],
        eventOffers: this.offersModel.getOfferById(this.pointsModel[i].type , this.pointsModel[i].offers),
        eventDestination: this.destinationsModel.getDestinationById(this.pointsModel[i].destination),
      }),
      this.eventListComponent.getElement());
    }
  }
}
