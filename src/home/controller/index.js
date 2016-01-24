'use strict';

import Base from './base.js';

var usernames = {};
var numUsers = 0;

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }

  testAction() {
    return this.display();
  }
}
