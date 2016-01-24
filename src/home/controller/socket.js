'use strict';

import Base from './base.js';

var chatrooms = {};

export default class extends Base {
  openAction() {

  }

  chatAction(self) {
    var members = chatrooms[ this.getRoom() ] || {};
    var {userId, message} = self.http.data;

    this.broadTo('chat', {
      displayName: members[userId].displayName,
      message
    });
  }

  closeAction(self) {
    var socket = self.http.socket,
        members = chatrooms[ this.getRoom() ] || {};

    var logoutUserId = Object.keys(members).filter(id => members[id].socket === socket);
    if( !logoutUserId ) return true;

    var logoutUser = members[logoutUserId];
    var displayName = logoutUser.displayName;
    delete members[logoutUserId];

    /**通知其他用户有用户离开并更新成员列表**/
    this.broadTo('user:exit', {
      exit: displayName,
      users: this.getUsers()
    });
  }

  adduserAction(self) {
    var socket = self.http.socket;
    var {room, userId, displayName} = self.http.data;
    if( !chatrooms[room] ) {
      chatrooms[room] = {};
    }

    var members = chatrooms[room];
    while(members[userId]) {
      userId += 1024;
    }

    /**通知其他用户有新用户加入，并更新用户列表**/
    this.broadTo('user:join', {
      join: displayName,
      users: this.getUsers().concat([displayName])
    });

    members[userId] = {displayName, socket};

    /**告诉本用户加入成功并更新用户 Id**/
    this.emit('user:login', userId);
  }

  getRoom() {
    return this.get('room') || 'test';
  }
  broadTo(event, data, filter = '') {
    var room = this.getRoom();
    var members = chatrooms[room] || {};
    for(var i in members) {
      if( i === filter ) continue;
      let member = members[i];
      member.socket.emit(event, data);
    }
  }
  getUsers() {
    var room = this.getRoom(),
        members = chatrooms[room];

    return Object.keys( members ).map( member => members[member].displayName );
  }
}
