'use strict';var _inherits = require('babel-runtime/helpers/inherits')['default'];var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];exports.__esModule = true;var _baseJs = require(

'./base.js');var _baseJs2 = _interopRequireDefault(_baseJs);

var usernames = {};
var numUsers = 0;var _default = (function (_Base) {_inherits(_default, _Base);function _default() {_classCallCheck(this, _default);_Base.apply(this, arguments);}


  /**
   * index action
   * @return {Promise} []
   */_default.prototype.
  indexAction = function indexAction() {
    //auto render template file index_index.html
    return this.display();};_default.prototype.


  testAction = function testAction() {
    return this.display();};_default.prototype.


  openAction = function openAction(self) {
    var socket = self.http.socket;
    this.broadcast('new message', { 
      username: socket.username, 
      message: self.http.data });};_default.prototype.


  closeAction = function closeAction() {};_default.prototype.


  adduserAction = function adduserAction(self) {
    var socket = self.http.socket;
    var username = self.http.data;
    console.log(username);};

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
  return _default;})(_baseJs2['default']);exports['default'] = _default;module.exports = exports['default'];