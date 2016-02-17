export default {
  on: true, //是否开启 WebSocket
  type: "socket.io",
  allow_origin: "",
  sub_protocal: "",
  adapter: undefined,
  path: "", //url path for websocket
  messages: {
    open: 'home/socket/open',
    close: 'home/socket/close',
    chat: 'home/socket/chat',
    adduser: 'home/socket/adduser',
    voice: '/home/socket/voice'
  }
};
