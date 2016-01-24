! function() {
	// 工具类
	function query(selector) {
		return document.querySelector(selector);
	}

	// 模版
	function generateMsg(msg) {
		var msgHTML = query('#msg-tpl').innerHTML;
		return msgHTML.replace(/\{(\w+)\}/g, function($0, $1) {
			return msg;
		});
	}

	function getRoomByUrl() {
		return location.search.match(/room=(\w+)?($|&)/)[1];
	}

	var name = localStorage.getItem('name');
	var id = localStorage.getItem('id');
	// 如果用户没登录就跳转给用户去登录
	if (!name || !id) {
		window.location.href = '/index/login';
	}

	var socket = io('http://localhost:8360');
	socket.emit('adduser', {
		room: getRoomByUrl(),
		userId: id,
		displayName: name
	});

	socket.on('user:join', function(data) {
		var usrList = query('user-list');
		console.log(data);
	});

	var sendBtn = query('.btn-send');
	var chatHistory = query('.chat-history');
	var inputBox = query('.input-box');
	var addMsg = function() {
		var msg = inputBox.innerText;
		inputBox.innerText = '';
		chatHistory.innerHTML += generateMsg(msg);
	};

	sendBtn.addEventListener('click', addMsg);
	inputBox.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) {
			addMsg();
		}
	});


}()