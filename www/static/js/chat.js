! function() {
	// 工具类
	function query(selector) {
		return document.querySelector(selector);
	}

	// 模版
	function generateHTML(el, data) {
		var msgHTML = query(el).innerHTML;

		function generate(data) {
			if (typeof(data) === 'string') {
				return msgHTML.replace(/\{(\w+)\}/g, function($0, $1) {
					return data;
				});

			} else {
				return msgHTML.replace(/\{(\w+)\}/g, function($0, $1) {
					return data[$1];
				});
			}
		}
		return Array.isArray(data) ? data.map(generate).join('') : generate(data);
	}

	function getRoomByUrl() {
		return location.search.match(/room=(\w+)?($|&)/)[1];
	}

	function renderDisplayName() {

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

	socket.on('user:login', function(data) {
		localStorage.setItem('id', data.userId);
		var usrList = query('.user-list');
		usrList.innerHTML = generateHTML('#usr-tpl', data.users);
	});

	socket.on('user:join', function(data) {
		var usrList = query('.user-list');
		var chatHistory = query('.chat-history');
		chatHistory.innerHTML += generateHTML('#tip-tpl', data.join + '已进入');
		usrList.innerHTML = generateHTML('#usr-tpl', data.users);
	});

	socket.on('user:exit', function(data) {
		var usrList = query('.user-list');
		var chatHistory = query('.chat-history');
		chatHistory.innerHTML += generateHTML('#tip-tpl', data.exit + '已退出');
		usrList.innerHTML = generateHTML('#usr-tpl', data.users);
	});

	socket.on('chat', function(data) {
		chatHistory.innerHTML += generateHTML('#msg-tpl', data);
		chatHistory.scrollTop = chatHistory.scrollHeight;
	});

	var sendBtn = query('.btn-send');
	var chatHistory = query('.chat-history');
	var inputBox = query('.input-box');
	var addMsg = function() {
		var msg = inputBox.innerText;
		inputBox.innerText = '';
		chatHistory.innerHTML += generateHTML('#msg-mine-tpl', {
			displayName: name,
			message: msg
		});
		chatHistory.scrollTop = chatHistory.scrollHeight;
		socket.emit('chat', {
			room: getRoomByUrl(),
			userId: id,
			message: msg
		})
	};

	sendBtn.addEventListener('click', addMsg);
	inputBox.addEventListener('keyup', function(e) {
		if (e.keyCode == 13) {
			addMsg();
		}
	});

}()