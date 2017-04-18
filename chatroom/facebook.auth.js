//var vidol_appId = '1090690301005006';
var vidol_appId = '1044817312247946';
var FacebookAuth = function FacebookAuth() {
	var myClass = '.FacebookAuth';
	var _this = this;
	this.debug = function (){
		console.log('FB_debug');
	}
	this.call_sdk = function (){
		console.log('FB_call_sdk');
		$.ajaxSetup({ cache: true });
		$.getScript('//connect.facebook.net/zh_TW/sdk.js?v=20200101', function(){
			FB.init({
				appId : vidol_appId,
				channelURL : 'http://app.vidol.tv/chatroom/index.php', 
				status : true,
				cookie : true,
				xfbml : true,
				version : 'v2.6'
			});
			FB.Event.subscribe('auth.login', function(){
			    window.location.href = 'http://app.vidol.tv/chatroom/index.php';
			});
			$('#loginbutton,#feedbutton').removeAttr('disabled');
			FB.getLoginStatus(function(response) {
				_this.status(response);
			});
		});
	}
	this.status = function (response){
		console.log('FB_status');
		console.log(response);
		if(response.status === 'connected'){
			// Logged into your app and Facebook.
			console.log('FB_#login fb in vidol');
			_this.get_user(response.authResponse);
			$('#input_messages').attr('disabled', false);
			$('#input_messages').attr('placeholder', '輸入發言...');
		}else if(response.status === 'not_authorized'){
			// The person is logged into Facebook, but not your app.
			console.log('FB_#login fb not in vidol');
			$('#input_messages').attr('disabled', true);
			$('#input_messages').attr('placeholder', '登入發言...');
		}else{
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			console.log('FB_#logout');
			$('#input_messages').attr('disabled', true);
			$('#input_messages').attr('placeholder', '登入發言...');
		}
	}
	this.auth = function (authResponse, userResponse){
		console.log('FB_auth');
		var fb_email = '';
		if(userResponse.email != undefined){
			fb_email = userResponse.email;
		}
		console.log(userResponse);
		$('input[name=nick_name]').val(userResponse.first_name);
		$.ajax({
			url: '/chatroom/auth.php',
			type: 'POST',
			crossDomain: true,
			cache: false,
			dataType: 'json',
			timeout: 5000,
			data: {
				'accessToken' : authResponse.accessToken,
				'expiresIn' : authResponse.expiresIn,
				'userID' : authResponse.userID,
				'email' : fb_email
			},
			error: function(xhr){
				console.log('FB_Ajax request error');
			},
			statusCode: {
			    200: function(data, statusText, xhr) {
			    	console.log('FB_ajax 200');
			    	$('input[name=token]').val(data.token);
			    	$('input[name=member_id]').val(data.member_id);
			    	//$('input[name=nick_name]').val(data.nick_name);
			    	$('input[name=propic]').val(data.propic);
			    }
			}
		});
	}
	//id,age_range,cover,currency,devices,email,first_name,gender,install_type,installed,is_verified,last_name,link,locale,name,name_format,payment_pricepoints';
	this.get_user = function (authResponse){
		console.log('FB_get_user');
		FB.api('/me', {fields: 'id,name,first_name,last_name,age_range,link,gender,locale,timezone,verified,email,birthday,location'}, function(response) {
			console.log('FB_/me');
			console.log(response);
			_this.auth(authResponse, response);
		});
	}
}

function fb_status(){
	var run = new FacebookAuth();
	run.call_sdk();
}

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = '//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.7&appId=' + vidol_appId;
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function(){
	fb_status();
});