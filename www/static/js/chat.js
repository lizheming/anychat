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

	function renderTip(tip) {
		chatHistory.innerHTML += generateHTML('#tip-tpl', tip);
	}

  function twinklingUser(msgUser, second) {
      $(".user-list").children("li").each(function(i, item) {
          if($(item).text() === msgUser) {
              $(item).css({"-webkit-animation":"twinkling 1s infinite ease-in-out"});
              setTimeout(function(){
                  $(item).css({"-webkit-animation": ""});
              }, second||5000);
          }
      })
  }

	function renderUsrList(users) {
		var usrList = query('.user-list');
		usrList.innerHTML = generateHTML('#usr-tpl', users);

		var mine = query('.user-list li[data-id="'+localStorage.id+'"]');
		if( !mine ) {
			return false;
		}

		var btn = document.createElement('button');
		btn.innerHTML = '修改';
		btn.onclick = function() {
			location.href = '/index/login'+location.search;
		}
		mine.appendChild( btn );
		mine.classList.add('circle');
	}

	function scrollHistoryBottom() {
		chatHistory.scrollTop = chatHistory.scrollHeight;
	}

	function notification(name,text) {
	  /** 标题状态改变 **/
		var o = document.title;
		document.title = '';
		var note = setInterval(function() {
			document.title = document.title.length > 1 ? document.title.substr(1) : name + ' 说...';
		}, 500);
		setTimeout(function() {
			clearInterval(note);
			document.title = o;
		}, 10000);
	  /** 语音提示 **/
		document.getElementById('notification').play();

	  /** 消息通知 **/
	  if(!Notification) return false;
	  if(Notification.permission != 'granted')
	      Notification.requestPermission(notification);
	  var notification = new Notification(name+' 说:', {
				dir: 'ltr',
				lang: 'zh-CN',
				body: text,
				tag: 'anychat',
				icon: null
	  });
		notification.onclose = function() {
			clearInterval(note);
			document.title = o;
		}
	  /** 点击后想增加一个跳转到该页面的代码 **/
		notification.onclick = function() {
			this.close();
		}
		notification.onshow = function() {
			setTimeout(notification.close, 10000);
		}
  }

	var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

	var name = localStorage.getItem('name');
	var id = localStorage.getItem('id');

	var sendBtn = query('.btn-send');
	var chatHistory = query('.chat-history');
	var inputBox = query('.input-box');
	var addMsg = function() {
		var msg = inputBox.innerText;
		inputBox.innerText = '';
		if(msg === '') {
			return alert('发送消息不能为空');
		}

		var data = {
			displayName: name,
			message: twemoji.parse(msg),
			avatar: name.charAt(0).toUpperCase(),
			background: COLORS[ name.charCodeAt(0)%COLORS.length ]
		};
		chatHistory.innerHTML += generateHTML('#msg-mine-tpl', data);

		var adminName = '系统消息';
		switch(msg) {
			case '/help':
			 	chatHistory.innerHTML += generateHTML('#msg-tpl', {
					displayName: adminName,
					message: '<p><b>/help</b> - 列出所有命令<p><p><b>/clear</b> - 清屏</p>',
					avatar: adminName.charAt(0),
					background: COLORS[ adminName.charCodeAt(0)%COLORS.length ]
				});
				break;
			case '/clear':
				chatHistory.innerHTML = '';
				break;
			default:
				socket.emit('chat', {
					room: getRoomByUrl(),
					userId: id,
					message: msg
				})
				break;
		}
		scrollHistoryBottom();
	};

	// 如果用户没登录就跳转给用户去登录
	if (!name || !id) {
		window.location.href = '/index/login' + location.search;
	}

	var socket = io(socketUrl);
	socket.emit('adduser', {
		room: getRoomByUrl(),
		userId: id,
		displayName: name
	});

	socket.on('user:login', function(data) {
		var usrList = query('.user-list');
		localStorage.setItem('id', data.userId);
		renderUsrList(data.users);
	});

	socket.on('user:join', function(data) {
		renderUsrList(data.users);
		renderTip(data.join + '已进入');
		scrollHistoryBottom();
	});

	socket.on('user:exit', function(data) {
		renderUsrList(data.users);
		renderTip(data.exit + '已退出');
		scrollHistoryBottom();
	});

	socket.on('chat', function(data) {
		chatHistory.innerHTML += generateHTML('#msg-tpl', {
			displayName: data.displayName,
			message: twemoji.parse(data.message),
			avatar: data.displayName.charAt(0).toUpperCase(),
			background: COLORS[ data.displayName.charCodeAt(0)%COLORS.length ]
		});
		if(document.hidden) {
			notification(data.displayName, data.message);
		}
		twinklingUser(data.displayName, 3000);
		scrollHistoryBottom();
	});

	sendBtn.addEventListener('click', addMsg);
	inputBox.addEventListener('keydown', function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return addMsg();
		}
	});

    // 二维码分享a
    $('#qrcode').children(".qr-content").qrcode({
                width: 256,
                height: 256,
                text: location.href
            })
          .end().children(".qr-des").text(location.href)
    $(".qr-share").on("click", function(e) {
        Custombox.open({
            target: "#qrcode",
            effect: "fadein"
        });
        e.preventDefault();
    });

	$('.btn-record').click(function() {
		var $btn = $(this);
		function onSuccess(stream) {
		    //创建一个音频环境对像
		    var audioContext = window.AudioContext || window.webkitAudioContext;
		    var context = new audioContext();

		    //将声音输入这个对像
		    audioInput = context.createMediaStreamSources(stream);

		    //设置音量节点
		    volume = context.createGain();
		    audioInput.connect(volume);

		    //创建缓存，用来缓存声音
		    var bufferSize = 2048;

		    // 创建声音的缓存节点，createJavaScriptNode方法的
		    // 第二个和第三个参数指的是输入和输出都是双声道。
		    recorder = context.createJavaScriptNode(bufferSize, 2, 2);

		    // 录音过程的回调函数，基本上是将左右两声道的声音
		    // 分别放入缓存。
		    recorder.onaudioprocess = function(e){
		        console.log('recording');
		        var left = e.inputBuffer.getChannelData(0);
		        var right = e.inputBuffer.getChannelData(1);
		        // we clone the samples
		        leftchannel.push(new Float32Array(left));
		        rightchannel.push(new Float32Array(right));
		        recordingLength += bufferSize;
		    }

		    // 将音量节点连上缓存节点，换言之，音量节点是输入
		    // 和输出的中间环节。
		    volume.connect(recorder);

		    // 将缓存节点连上输出的目的地，可以是扩音器，也可以
		    // 是音频文件。
		    recorder.connect(context.destination);

		}
	})
}()
