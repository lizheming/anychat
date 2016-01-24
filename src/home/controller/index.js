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

  openAction(self){
    var socket = self.http.socket;
    this.broadcast('new message', {
      username: socket.username,
      message: self.http.data
    });
  }
  closeAction(){

  }
  adduserAction(self){
    var socket = self.http.socket;
    var username = self.http.data;
    console.log(username);
  }
  // closeAction(self){
  //   var socket = self.http.socket;
  //   // remove the username from global usernames list
  //   if (socket.username) {
  //     delete usernames[socket.username];
  //     --numUsers;
  //     // echo globally that this client has left
  //     this.broadcast('userleft', {
  //       username: socket.username,
  //       numUsers: numUsers
  //     });
  //   }
  // }
  // chatAction(self){
  //   var socket = self.http.socket;
  //   // we tell the client to execute 'chat'
  //   this.broadcast('chat', {
  //     username: socket.username,
  //     message: self.http.data
  //   });
  // }
  // typingAction(self){
  //   var socket = self.http.socket;
  //   this.broadcast('typing', {
  //     username: socket.username
  //   });
  // }
  // stoptypingAction(self){
  //   var socket = self.http.socket;
  //   this.broadcast('stoptyping', {
  //     username: socket.username
  //   });
  // }
}
