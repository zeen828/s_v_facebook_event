function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	//return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
	return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate() + "  " + strTime;
}

var WebSocketEvent = function WebSocketEvent() {
	var myClass = '.WebSocketEvent';
	var _this = this;
	var websocket;
	var websocket_url;
	this.debug = function (){
		console.log('WS_debug');
	}
	this.call_connect = function (){
		console.log('WS_call_connect');
		websocket_url = $('input[name="websocket"]').val();
		websocket = new WebSocket(websocket_url);
		//websocket = new WebSocket("ws://ws-event.vidol.tv:8080/barrage");
		websocket.onopen = function(evt) {
			console.log('WS_onopen');
			var video_type = $('select[name="video_type"]').val();
			var video_id = $('input[name="video_id"]').val();
			_this.send_room('{"video_type":"'+video_type+'","video_id":"'+video_id+'"}');
		};
		websocket.onmessage = function(evt) {
			console.log('WS_onmessage');
			var json_obj = $.parseJSON(evt.data);
			$('.count').html(json_obj.userinroom);
			$.each(json_obj.data, function (index, value) {
				console.log(value);
				var create_date = new Date(value.time_unix * 1000)
				var create_date_format = formatDate(create_date);
				if(value.messages != undefined){
					$('#js_output').append('<li><img alt="propic" src="' + value.propic + '" class="user_propic img_round"><span class="user_name">' + value.nick_name + '</span><br/><span class="user_messages">' + value.messages + '</span><br/><span class="user_date">' + create_date_format + '</span></li>');
				}
				$('.chatroom_messages').scrollTop($('#js_output').height());
			});
		};
		websocket.onerror = function(evt) {
			console.log('WS_onerror');
			$('#js_output').append('<li class="error">' + evt.data + '</li>');
		};
	}
	this.send_room = function (message){
		console.log('WS_send_room');
		websocket.send(message);
	}
	this.close = function (message){
		console.log('WS_close');
		websocket.close()
	}
	this.send_message = function (){
		console.log('WS_send_message');
		var token = $('input[name="token"]').val();
		var programme = $('input[name="programme"]').val();
		var video_type = $('select[name="video_type"]').val();
		var video_id = $('input[name="video_id"]').val();
		var user = $('input[name="user"]').val();
		var member_id = $('input[name="member_id"]').val();
		var nick_name = $('input[name="nick_name"]').val();
		var propic = $('input[name="propic"]').val();
		var messages = $('input[name="messages"]').val();
		var barrage = $('input[name="barrage"]').val();
		var video_time = $('input[name="video_time"]').val();
		var position = $('input[name="position"]').val();
		console.log(token);
		if(token != undefined && token != ''){
			$.ajax({
				url: 'http://plugin-boards.vidol.tv/api/boards/message.json',
				type: 'POST',
				cache: false,
				dataType: 'json',
				timeout: 500,
				data: {
					'token' : token,
					'programme' : programme,
					'video_type' : video_type,
					'video_id' : video_id,
					'user' : user,
					'member_id' : member_id,
					'nick_name' : nick_name,
					'propic' : propic,
					'msg' : messages,
					'barrage' : barrage,
					'video_time' : video_time,
					'position' : position
				},
				error: function(xhr){
					console.log('WS_Ajax request error');
				},
				statusCode: {
				    201: function(data, statusText, xhr) {
				    	console.log('WS_ajax 201');
				    	$('.chatroom_messages').scrollTop($('#js_output').height());
				    }
				}
			});
		}else{
			alert('請登入會員');
		}
	}
	this.restart_event = function (){
		console.log('WS_restart_event');
		$('button.connection, input.connection').click(function(e) {
			console.log('連線');
			_this.call_connect();
		});
		$('button.close, input.close').click(function(e) {
			console.log('斷線');
			$('#js_output').html('');
			$('.ws_count .count').html('0');
			_this.close();
		});
		$('input[name="messages"]').keypress(function(e) {
			if(this.value) {
				if (e.keyCode == 13) {
					_this.send_message();
					this.value = null;
				}
			}
		});
		$('button').click(function(e) {
			var msg = $('input[name="messages"]').val();
			if(msg != ''){
				_this.send_message();
				$('input[name="messages"]').val('');
			}
		});
	}
}

$(document).ready(function(){
	var run = new WebSocketEvent();
	//run.call_connect();
	run.restart_event();
});