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

  loginAction() {
    this.checkRoom();
  }

  checkRoom() {
    /** 必须选择一个聊天室否则随机 **/
    if( !this.get('room') ) {
     this.http.redirect('?room=' + think.md5(Date.now()).slice(0,8) );
    }
  }
}
