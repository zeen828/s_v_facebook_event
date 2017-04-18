<?php
session_start ();
ini_set ( 'display_errors', 'On' ); // On, Off
define ( '__ROOT__', dirname ( __FILE__ ) );
define ( '__LIB_PATH__', dirname ( dirname ( __FILE__ ) ) );
define ( '__DONAME__', $_SERVER ['HTTP_HOST'] );
define ( '__PUTH__', 'chatroom' );
define ( '__INDEX__', basename ( __FILE__ ) );
define ( '__URI__', sprintf ( 'http://%s/%s/%s', __DONAME__, __PUTH__, __INDEX__ ) );

require_once (__LIB_PATH__ . '/Facebook/vidol.config.php');
require_once (__LIB_PATH__ . '/Facebook/autoload.php');

$login_Url = '#';
$logout_Url = '#';

// FB SDK宣告
$fb = new Facebook\Facebook ( [ 
		'app_id' => __FB_ID__,
		'app_secret' => __FB_SECRET__,
		'default_graph_version' => 'v2.7' 
] );
$helper = $fb->getRedirectLoginHelper ();

// FB登入處理
try {
	$accessToken = $helper->getAccessToken ();
	// var_dump($accessToken);
} catch ( Facebook\Exceptions\FacebookResponseException $e ) {
	echo 'Graph returned an error: ' . $e->getMessage ();
} catch ( Facebook\Exceptions\FacebookSDKException $e ) {
	echo 'Facebook SDK returned an error: ' . $e->getMessage ();
}

// FB登入檢查
if (isset ( $accessToken )) {
	try {
		// 登出網址
		$logout_Url = sprintf ( 'https://www.facebook.com/logout.php?access_token=%s&next=%s', $accessToken->getValue (), urlencode ( __URI__ ) );
		// FB取得用戶基本資料
		$response = $fb->get ( '/me?fields=id,name,first_name,last_name,age_range,link,gender,locale,timezone,verified,email,birthday,location', $accessToken );
		$fb_user = $response->getGraphUser ();
		//莫名其妙不列印無法取得值
		// var_dump($fb_user);
		print_r($fb_user, true);
		$fbBirthday = $fb_user->getBirthday ();
		$fbLocation = $fb_user->getLocation ();
		// vidol SESSION時效
		$expiration_time = isset ( $_SESSION ['expiration_time'] ) ? $_SESSION ['expiration_time'] : 0;
		if (true || $fb_user ['id'] && $expiration_time < time ()) {
			// vidol登入/註冊
			$data = array ();
			$data ['grant_type'] = 'password';
			$data ['facebook_token'] = $accessToken->getValue ();
			$data ['expiration_date'] = $accessToken->getExpiresAt ();
			$data ['user_id'] = $fb_user ['id'];
			$data ['nick_name'] = ($fb_user ['name']) ? $fb_user ['name'] : '';
			$data ['contact_email'] = (isset($fb_user ['email'])) ? $fb_user ['email'] : '';
			$data ['gender'] = (isset($fb_user ['gender'])) ? $fb_user ['gender'] : '';
			$data ['birth_date'] = (isset($fbBirthday->date)) ? mb_substr($fbBirthday->date, 0, 10, 'UTF-8') : '';
			$data ['address'] = (isset($fbLocation ['name'])) ? $fbLocation ['name'] : '';
			// 無法回填物件
			// $data ['age_range'] = '{"min":' . $fb_user ['age_range'] ['min'] . ' }';
			// print_r ( $data );
			$request = 'http://api-background.vidol.tv/v1/oauth/token';
			$ch = curl_init ( $request );
			curl_setopt_array ( $ch, array (
					CURLOPT_POST => TRUE,
					CURLOPT_RETURNTRANSFER => TRUE,
					CURLOPT_TIMEOUT_MS => 1000,
					CURLOPT_SSL_VERIFYPEER => FALSE,
					CURLOPT_HTTPHEADER => array (
							'Content-Type: application/json',
							'Authorization: Basic MWIyNjZkNjI0OWJiYjljM2M2ZDdkYjM0YWU1YzU5YzZhMzYyZmQxODgxOGJkMzM2NmNiYjY5YTUzOGYwZmU2NDpjODNlMDkxMmQ5MWI1NjAzM2RlNmFmODdjZDIxZGZkODk1NTBkNzA4M2Q3ODM0ZDIyMWVmNmNkZGM5ODg4ZjM2' 
					),
					CURLOPT_POSTFIELDS => json_encode ( $data ) 
			) );
			$response = curl_exec ( $ch );
			curl_close ( $ch );
			$data_json_token = json_decode ( $response );
			// print_r($data_json_token);
			// vidol登入/註冊成功
			if (! empty ( $data_json_token->access_token ) && ! empty ( $data_json_token->token_type )) {
				$auth_string = sprintf ( '%s %s', $data_json_token->token_type, $data_json_token->access_token );
				$request = 'http://api-background.vidol.tv/v1/profile';
				$ch = curl_init ( $request );
				curl_setopt_array ( $ch, array (
						CURLOPT_RETURNTRANSFER => TRUE,
						CURLOPT_TIMEOUT_MS => 1000,
						CURLOPT_SSL_VERIFYPEER => FALSE,
						CURLOPT_HTTPHEADER => array (
								'Content-Type: application/json',
								'Authorization: ' . $auth_string 
						) 
				) );
				$response = curl_exec ( $ch );
				curl_close ( $ch );
				$data_json_user = json_decode ( $response );
				// print_r($data_json_user);
				if (isset ( $data_json_user->member_id )) {
					$_SESSION ['expiration_time'] = strtotime ( $data_json_token->created_at . '+' . $data_json_token->expires_in . ' sec' );
					$_SESSION ['access_token'] = sprintf ( '%s %s', $data_json_token->token_type, $data_json_token->access_token );
					$_SESSION ['member_id'] = ($data_json_user->member_id) ? $data_json_user->member_id : '';
					$_SESSION ['nick_name'] = ($fb_user ['name']) ? $fb_user ['name'] : '';
					$_SESSION ['propic'] = sprintf ( 'https://graph.facebook.com/%s/picture?type=small', $fb_user ['id'] );
					// print_r($_SESSION);
				}
				if(!isset ( $data_json_user->contact_email ) || !isset ( $data_json_user->nick_name ) || !isset ( $data_json_user->gender ) || !isset ( $data_json_user->birth_date ) || !isset ( $data_json_user->address )){
					echo 'UPDATE:';
					/// 更新會員資料
					$data = array ();
					if(!isset ( $data_json_user->contact_email )){
						$data ['contact_email'] = (isset($fb_user ['email'])) ? $fb_user ['email'] : '';
					}
					if(!isset ( $data_json_user->nick_name )){
						$data ['nick_name'] = ($fb_user ['name']) ? $fb_user ['name'] : '';
					}
					if(!isset ( $data_json_user->gender )){
						$data ['gender'] = (isset($fb_user ['gender'])) ? $fb_user ['gender'] : '';
					}
					if(!isset ( $data_json_user->birth_date )){
						$data ['birth_date'] = (isset($fbBirthday->date)) ? mb_substr($fbBirthday->date, 0, 10, 'UTF-8') : '';
					}
					if(!isset ( $data_json_user->address )){
						$data ['address'] = (isset($fbLocation ['name'])) ? $fbLocation ['name'] : '';
					}
					$request = 'http://api-background.vidol.tv/v1/profile';
					$ch = curl_init ( $request );
					curl_setopt_array ( $ch, array (
							CURLOPT_CUSTOMREQUEST => 'PUT',
							CURLOPT_RETURNTRANSFER => TRUE,
							CURLOPT_TIMEOUT_MS => 1000,
							CURLOPT_SSL_VERIFYPEER => FALSE,
							CURLOPT_HTTPHEADER => array (
									'Content-Type: application/json',
									'Authorization: ' . $auth_string
							),
							CURLOPT_POSTFIELDS => json_encode ( $data )
					) );
					$response = curl_exec ( $ch );
					curl_close ( $ch );
				}
			}
		}
	} catch ( Facebook\Exceptions\FacebookResponseException $e ) {
		echo 'Graph returned an error: ' . $e->getMessage ();
	} catch ( Facebook\Exceptions\FacebookSDKException $e ) {
		echo 'Facebook SDK returned an error: ' . $e->getMessage ();
	}
} else {
	$login_Url = $helper->getLoginUrl ( __URI__, [ 
			'email',
			'user_birthday',
			'user_location' 
	] );
	// header ( 'Location: ' . $login_Url );
}
?>
<html>
	<head>
		<title>jQuery Example</title>
		<meta charset="utf-8">
		<meta http-equiv="Cache-control" content="public">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style type="text/css">
		header{
			width: 100%;
		}
		nav{
			width: 100%;
		}
		article{
			width: 70%;
			float: left;
		}
		aside{
			width: 30%;
			float: right;
		}
		footer{
			width: 100%;
			clear: both;
		}
		img{
			width: 25px;
			height: 25px;
			-webkit-border-radius: 25px;
			-moz-border-radius: 25px;
			border-radius: 25px;
		}
		.chatroom{
			overflow: scroll;
			height: 400px;
			border: solid 1px #aaa;
			margin: 0 auto;
		}
		.list{
			
		}
		.list li{
			list-style-type: none;
		}
		.error{
			color:#FF0000;
		}
		</style>
	</head>
	<body>
		<header>
			頁首
			<input type="hidden" name="token" value="<?php echo (isset($_SESSION['access_token']))? $_SESSION['access_token'] : '';?>" />
			<input type="hidden" name="programme" value="" />
			<input type="hidden" name="video_type" value="event" />
			<input type="hidden" name="video_id" value="20" />
			<input type="hidden" name="user" value="" />
			<input type="hidden" name="member_id" value="<?php echo (isset($_SESSION['member_id']))? $_SESSION['member_id'] : '';?>" />
			<input type="hidden" name="nick_name" value="<?php echo (isset($_SESSION['nick_name']))? $_SESSION['nick_name'] : '';?>" />
			<input type="hidden" name="propic" value="<?php echo (isset($_SESSION['propic']))? $_SESSION['propic'] : '';?>" />
			<input type="hidden" name="barrage" value="Y" />
			<input type="hidden" name="video_time" value="0" />
			<input type="hidden" name="position" value="0,0" />
		</header>
		<nav>導覽列</nav>
		<article>
			<section>
				<!-- Your embedded video player code -->
				<iframe width="560" height="315" src="https://www.youtube.com/embed/6_O33G5OJRA" frameborder="0" allowfullscreen></iframe>
			</section>
		</article>
		<aside>
			<section>
			
				
				
				<div id="fb-root"></div>
<?php
if($logout_Url == '#'){
	//https://www.facebook.com/dialog/oauth?client_id=1044817312247946&redirect_uri=http%3A%2F%2Fapp.vidol.tv%2Fchatroom%2Findex.php
?>
<a href="<?php echo $login_Url;?>">login</a>
<?php
}else{
?>
<a href="<?php echo $logout_Url;?>">logout</a>
<?php
}
?>
			</section>
			<section>
				在線人數:<span class="count">0</span>
				<div class="chatroom">
					<ul id="js_output" class="list">
					</ul>
				</div>
<?php
if($logout_Url == '#'){
?>
<input name="messages" id="input_messages" placeholder="登入發言" disabled="disabled" />
<?php
}else{
?>
<input name="messages" id="input_messages" placeholder="輸入發言..." />
<?php
}
?>
			</section>
		</aside>
		<footer>
			頁尾
		</footer>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js?v=20200101"></script>
		<script src="websocket.event.js?v=20200101"></script>
		<script type="text/javascript">
		$(document).ready(function(){
		});
		</script>
	</body>
</html>
