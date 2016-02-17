'use strict';

import Base from './base.js';

var chatrooms = {};

export default class extends Base {
  openAction() {

  }

  chatAction(self) {
    var {
      room, userId, message
    } = self.http.data;
    var members = chatrooms[room];

    if (!members[userId]) return false;

    this.broadTo('chat', {
      displayName: members[userId].displayName,
      message
    }, room, userId);
  }

  voiceAction(self) {
    var {
      room, userId, message
    } = self.http.data;
    var members = chatrooms[room];

    if (!members[userId]) return false;

    this.broadTo('chat:voice', {
      displayName: members[userId].displayName,
      message
    }, room, userId);
  }

  closeAction(self) {
    var socket = self.http.socket;
    var logoutRoom, logoutUserId, logoutUser;
    for (var room in chatrooms) {
      var members = chatrooms[room];
      for (var userId in members) {
        if (members[userId].socket === socket) {
          logoutRoom = room;
          logoutUserId = userId;
          logoutUser = members[userId];
        }
      }
    }

    if (!logoutUserId) return true;

    var displayName = logoutUser.displayName;
    delete chatrooms[logoutRoom][logoutUserId];

    /**通知其他用户有用户离开并更新成员列表**/
    this.broadTo('user:exit', {
      exit: displayName,
      users: this.getUsers(logoutRoom)
    }, logoutRoom);
  }

  adduserAction(self) {
    var socket = self.http.socket;
    var {
      room, userId, displayName
    } = self.http.data;
    if (!chatrooms[room]) {
      chatrooms[room] = {};
    }

    var members = chatrooms[room];
    while (members[userId]) {
      userId += 1;
    }

    /**通知其他用户有新用户加入，并更新用户列表**/
    this.broadTo('user:join', {
      join: displayName,
      users: this.getUsers(room).concat([displayName])
    }, room);

    members[userId] = {
      displayName, socket
    };

    /**告诉本用户加入成功并更新用户 Id**/
    this.emit('user:login', {
      userId, users: this.getUsers(room)
    });
  }

  broadTo(event, data, room, filter = false) {
    var members = chatrooms[room] || {};
    for (var i in members) {
      if (i === filter) continue;
      let member = members[i];
      member.socket.emit(event, data);
    }
  }

  getUsers(room) {
    var members = chatrooms[room];

    return Object.keys(members).map(member => ({id: member, name: members[member].displayName}));
  }
}
