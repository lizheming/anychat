'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    return this.display();
  }

  loginAction() {
    return this.display();
  }

  testAction() {
    return this.display();
  }
}