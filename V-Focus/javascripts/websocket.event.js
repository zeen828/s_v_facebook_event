function formatDate(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'P.M.' : 'A.M.';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = ampm+' '+hours + ':' + minutes;
	return date.getFullYear() +"/"+ (date.getMonth()+1) + "/" + date.getDate() + "  " + strTime;
}

var WebSocketEvent = function WebSocketEvent() {
	var myClass = '.WebSocketEvent';
	var _this = this;
	var websocket;
	this.debug = function (){
		console.log('WS_debug');
	}
	this.call_connect = function (){
		//console.log('call_connect');
		websocket = new WebSocket("ws://ws-event.vidol.tv:8080/barrage");
		websocket.onopen = function(evt) {
			var video_type = $('input[name="video_type"]').val();
			var video_id = $('input[name="video_id"]').val();
			_this.send_room('{"video_type":"'+video_type+'","video_id":"'+video_id+'"}');
		};
		websocket.onmessage = function(evt) {
			var $block = $('.messageUl');
			var json_obj = $.parseJSON(evt.data);
			var dataLength = json_obj.data.length;
			$('.count').html(json_obj.userinroom);
			if( dataLength!=0 ){
				for( e=0 ; e<dataLength ; e++ ){
					if( json_obj.data[e].messages!=undefined ){
						var create_data 				= new Date(json_obj.data[e].time_unix * 1000);
						var create_data_format 	= formatDate(create_data);
						$block.append('<li>'+
								'<div class="left">'+
								'<div class="img" style="background-image:url('+json_obj.data[e].propic+');"></div>'+
								'</div>'+
								'<div class="right">'+
								'<div class="name">'+json_obj.data[e].nick_name+'</div>'+
								'<div class="block">'+
								'<p>'+json_obj.data[e].messages+'</p>'+
								'</div>'+
								'<div class="time">'+create_data_format+'</div>'+
								'</div>'+
						'</li>');
						if( e>=dataLength-1 ){
							//$message.addClass();
							listUlReset();
							retest();
						}
					}
				}
			}
		};
		websocket.onerror = function(evt) {
			//console.log('WS_onerror');
			$('#js_output').append('<li class="error">' + evt.data + '</li>');
		};
	}
	this.send_room = function (message){
		websocket.send(message);
	}
	this.send_message = function (){
		console.log('WS_send_message');
		var token = $('input[name="token"]').val();
		var programme = $('input[name="programme"]').val();
		var video_type = $('input[name="video_type"]').val();
		var video_id = $('input[name="video_id"]').val();
		var user = $('input[name="user"]').val();
		var member_id = $('input[name="member_id"]').val();
		var nick_name = $('input[name="nick_name"]').val();
		var propic = $('input[name="propic"]').val();
		var messages = $('input[name="messages"]').val();
		var barrage = $('input[name="barrage"]').val();
		var video_time = $('input[name="video_time"]').val();
		var position = $('input[name="position"]').val();
		if(token != undefined && token != ''){
			$.ajax({
				url: 'http://plugin-background.vidol.tv/api/boards/message.json',
				type: 'POST',
				cache: false,
				dataType: 'json',
				timeout: 500,
				data: {
					'token'				: token,
					'programme' 	: programme,
					'video_type' 	: video_type,
					'video_id' 		: video_id,
					'user' 				: user,
					'member_id' 	: member_id,
					'nick_name' 	: nick_name,
					'propic' 			: propic,
					'msg' 				: messages,
					'barrage' 		: barrage,
					'video_time' 	: video_time,
					'position' 		: position
				},
				error: function(xhr){
					//console.log('WS_Ajax request error');
				},
				statusCode: {
					201: function(data, statusText, xhr) {
						//console.log('WS_ajax 201');
						$('.chatroom').scrollTop($('#js_output').height());
					}
				}
			});
		}else{
			alert('請登入會員');
		}
	}
	this.restart_event = function (){
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

/*$(document).ready(function(){
	var run = new WebSocketEvent();
	run.call_connect();
	run.restart_event();
});*/

$(function(){
	$(window).load(function() {
		var run = new WebSocketEvent();
		run.call_connect();
		run.restart_event();
	});
})
