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
	if (!name || !id) {
		window.location.href = '/index/login';
	}

	var socket = io('http://localhost:8360');
	var res = socket.emit('adduser', {
		room: getRoomByUrl(),
		userId: id,
		displayName: name
	});

	socket.on('user:join', function(data) {
		console.log(data);
	});

	var sendBtn = query('.btn-send');
	sendBtn.addEventListener('click', function() {
		var inputBox = query('.input-box');
		var msg = inputBox.innerText;
		var chatHistory = query('.chat-history');
		chatHistory.innerHTML = generateMsg(msg);
	})
}()