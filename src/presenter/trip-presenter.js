import {render} from '../render.js';
import PointListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import PointView from '../view/event-point-view.js';
import EditingEventView from '../view/event-editing-view.js';

export default class TripPresenter {
  eventListComponent = new PointListView();

  constructor({pointContainer}) {
    this.pointContainer = pointContainer;
  }

  init() {
    render(new SortingView(), this.pointContainer);
    render(this.eventListComponent, this.pointContainer);

    render(new EditingEventView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
