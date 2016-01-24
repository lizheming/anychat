'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //'http://localhost:8360'
    this.assign('socketUrl', 'http://' + this.http.host);
    return this.display();
  }

  loginAction() {
    return this.display();
  }

  testAction() {
    return this.display();
  }
}