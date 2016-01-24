'use strict';var _inherits = require('babel-runtime/helpers/inherits')['default'];var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];exports.__esModule = true;var _baseJs = require(

'./base.js');var _baseJs2 = _interopRequireDefault(_baseJs);

var chatrooms = {};var _default = (function (_Base) {_inherits(_default, _Base);function _default() {_classCallCheck(this, _default);_Base.apply(this, arguments);}_default.prototype.


  openAction = function openAction() {};_default.prototype.



  chatAction = function chatAction(self) {
    var members = chatrooms[this.getRoom()] || {};var _self$http$data = 
    self.http.data;var userId = _self$http$data.userId;var message = _self$http$data.message;

    this.broadTo('chat', { 
      displayName: members[userId].displayName, 
      message: message });};_default.prototype.



  closeAction = function closeAction(self) {
    var socket = self.http.socket, 
    members = chatrooms[this.getRoom()] || {};

    var logoutUserId = _Object$keys(members).filter(function (id) {return members[id].socket === socket;});
    if (!logoutUserId) return true;

    var logoutUser = members[logoutUserId];
    var displayName = logoutUser.displayName;
    delete members[logoutUserId];

    /**通知其他用户有用户离开并更新成员列表**/
    this.broadTo('user:exit', { 
      exit: displayName, 
      users: this.getUsers() });};_default.prototype.



  adduserAction = function adduserAction(self) {
    var socket = self.http.socket;var _self$http$data2 = 
    self.http.data;var room = _self$http$data2.room;var userId = _self$http$data2.userId;var displayName = _self$http$data2.displayName;
    if (!chatrooms[room]) {
      chatrooms[room] = {};}


    var members = chatrooms[room];
    while (members[userId]) {
      userId += 1024;}


    /**通知其他用户有新用户加入，并更新用户列表**/
    this.broadTo('user:join', { 
      join: displayName, 
      users: this.getUsers().concat([displayName]) });


    members[userId] = { displayName: displayName, socket: socket };

    /**告诉本用户加入成功并更新用户 Id**/
    this.emit('user:login', userId);};_default.prototype.


  getRoom = function getRoom() {
    return this.get('r') || 1234;};_default.prototype.

  broadTo = function broadTo(event, data) {var filter = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
    var room = this.getRoom();
    var members = chatrooms[room] || {};
    for (var i in members) {
      if (i === filter) continue;
      var member = members[i];
      member.socket.emit(event, data);}};_default.prototype.


  getUsers = function getUsers() {
    var room = this.getRoom(), 
    members = chatrooms[room];

    return _Object$keys(members).map(function (member) {return members[member].displayName;});};return _default;})(_baseJs2['default']);exports['default'] = _default;module.exports = exports['default'];