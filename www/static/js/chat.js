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

	var sendBtn = query('.btn-send');
	sendBtn.addEventListener('click', function() {
		var inputBox = query('.input-box');
		var msg = inputBox.innerText;
		var chatHistory = query('.chat-history');
		chatHistory.innerHTML = generateMsg(msg);
	})
}()