import {createElement} from '../render.js';

function eventPointListTemplate() {
  return `
    <ul class="trip-events__list"></ul>
  `;
}

export default class EventPointListView {
  getTemplate() {
    return eventPointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
