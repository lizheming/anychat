'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  indexAction(){
    this.checkRoom();
  }

  chatAction() {
    this.checkRoom();
  }

  checkRoom() {
    /** 必须选择一个聊天室否则随机 **/
    if( !this.get('chat') ) {
    	this.http.redirect('chat/' + Date.now());
    }
  }
}
