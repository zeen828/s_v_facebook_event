<?php
session_start();
ini_set ( 'display_errors', 'On' ); // On, Off
header("Content-Type:text/html; charset=utf-8");
if(!isset($_SESSION['GoogleAuthenticator']) || empty($_SESSION['GoogleAuthenticator'])){
	require_once '../third_party/PHPGangsta/GoogleAuthenticator.php';
	$ga = new PHPGangsta_GoogleAuthenticator();
	$secret ='WWAYZDXO4JD3CVKO';
	//https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth%3A%2F%2Ftotp%2FiOS%3Fsecret%3DYAM7XZJDA2LPABW2%26issuer%3Dhttp%253A%252F%252Fvidol.tv
	$oneCode = $ga->getCode($secret);
	//echo "Secret ".$secret."</br>";
	//echo "OTP".$ga->getCode($secret)."</br>"
	$_SESSION['GoogleAuthenticator'] = false;
	$username = isset($_POST['username'])? !empty($_POST['username']) : false;
	$password = isset($_POST['password'])? !empty($_POST['password']) : false;
	$oneCode = isset($_POST['oneCode'])? !empty($_POST['oneCode']) : false;
	$code_text = isset($_POST['code_text'])? !empty($_POST['code_text']) : false;
	$file = "./data/ios_air";
	if($oneCode && $username == 'vidol' & $password == '123456'){
		$oneCode = $_POST['oneCode'];
		//echo $oneCode . '</br>';
		$checkResult = $ga->verifyCode($secret, $oneCode, 30);    // 2 = 2*30sec clock tolerance
		//var_dump($checkResult);
		if ($checkResult) {
			$_SESSION['GoogleAuthenticator'] = true;
			//echo 'OK';
		} else {
			echo 'FAILED';
		}
	}elseif($oneCode && $code_text){
		$oneCode = $_POST['oneCode'];
		$code_text = $_POST['code_text'];
		$checkResult = $ga->verifyCode($secret, $oneCode, 30);    // 2 = 2*30sec clock tolerance
		if ($checkResult) {
			file_put_contents($file, $code_text);
			echo '儲存成功';
		}else
		{
			echo '儲存失敗';
			$_SESSION['GoogleAuthenticator'] = false;
		}
	
	}
}
?>
<?php
require_once ('config.php');
$expiration_time = isset ( $_SESSION ['expiration_time'] ) ? $_SESSION ['expiration_time'] : 0;
if($expiration_time < time ()){
	$login = true;
}else{
	$login = false;
}
?>
<?php
if(empty($_SESSION['GoogleAuthenticator'])){
?>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<title></title>
		<link rel="stylesheet" type="text/css" href="../v1/css/appStyle.css">
	</head>

	<body>
			<div class="block">
				<form id="frm_login" name="frm_login" action="" method="post" style="width: 100%; height: 80px;">
					<ul>
						<li>
							<label for="username">Username:</label>
							<input type="text" name="username" />
						</li>
						<li>
							<label for="password">Password:</label>
							<input type="password" name="password" />
						</li>

						<li>
							<label for="oneCode">動態驗證碼:</label>
							<input type="text" name="oneCode"/>
						</li>

						<li>
							<button type="submit" name="submit_btn">LOGIN 登入</button>
						</li>
					</ul>
				</form>
			</div>

	</body>
</html>
<?php }else { ?>
<html>
	<head>
		<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
		<title>聊天室範例</title>
		<meta charset="utf-8">
		<meta http-equiv="Cache-control" content="public">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style type="text/css">
		body {
			margin: 0px;
		}
		header{
			width:100%;
			height:5%;
			background-color:#f36;
		}
		.maim {
			width:100%;
			height:95%;
			margin:0;
			padding:0;
			background-color: #000;
			-moz-background-size: cover;
			background-size: cover;

		}
		.menu {
			width:100%;
		}
		.menu_left {
			width:50%;
			color: #fff;
			direction:ltr;
		}
		.ws_count {
			padding: 10px;
		}
		.menu_right {
			width:50%;
			color:#fff;
			direction:rtl;
		}
		.fb_but {
			width:40px;
			padding:10px;
			background-color:#3c56a1;
		}
		.fb_logon {
			color:#fff;
			text-decoration:none;
		}
		.chatroom {
			width:100%;
			color: #fff;
			line-height: 1.5em;
			background-color: #333;
		}
		.chatroom_messages {
			overflow:scroll;
			/*height:200px;*/
			height:90%;
			border:solid 0px #aaa;
			margin:0 auto;
			overflow-x:hidden;
			/*overflow-y:hidden;*/
		}
		.chatroom_messages ul {
			-webkit-padding-start: 10px;
		}
		.user_name{
			color: #FFC107;
		}
		.user_messages{
			color: #FFFFF;
		}
		.user_date{
			color: #777;
		}
		.chatroom_input #input_messages {
			width:80%;
			height: 40px;
			font-size: 1em;
			color: #fff;
			background-color: #000;
			border: none;
			border-top: 1px solid #555;
			padding: 0px 10px;
		}
		button.connection, .chatroom_input .submit {
			width:20%;
			height: 40px;
			font-size: 1em;
			color: #fff;
			background-color: #472fff;
			border: none;
		}
		footer{
			width:100%;
		}
		.list li{
			/*去除點點*/
			list-style-type:none;
		}
		.float_left{
			float:left;
		}
		.float_right{
			float:right;
		}
		.float_clear{
			clear:both; 
		}
		.float_center {
			margin: 0px auto;
		}
		.img_round {
			width : 25px;
			height : 25px;
			-webkit-border-radius : 25px;
			-moz-border-radius : 25px;
			border-radius : 25px;
		}
		</style>
	</head>
	<body>
		<header class="float_clear">
			<label>video type</label>
			<select name="video_type" class="form-control">
				<option value="channel">channel</option>
				<option value="episode">episode</option>
				<option value="live">live</option>
				<option value="event">event</option>
				<option value="forum">forum</option>
			</select>
			<label>video id</label>
			<input type="text" name="video_id" class="form-control" value="1" placeholder="影片編號.." />
			<label>member id</label>
			<input type="text" name="member_id" value="<?php echo (isset($_SESSION['vidol_member_id']))? $_SESSION['vidol_member_id'] : '';?>" />
			<label>nick name</label>
			<input type="text" name="nick_name" value="<?php echo (isset($_SESSION['vidol_nick_name']))? $_SESSION['vidol_nick_name'] : '';?>" />
			<label>propic</label>
			<input type="text" name="propic" value="<?php echo (isset($_SESSION['vidol_propic']))? $_SESSION['vidol_propic'] : '';?>" />
			<button class="submit connection float_right">連線</button>
		</header>
		<article class="maim float_clear">
			<nav class="menu float_left">
				<div class="menu_left float_left">
					<div class="ws_count">
						在線人數:<span class="count">0</span>
					</div>
				</div>
				<div class="menu_right float_right">
					<div class="fb_but">
<?php
if($login){
?>
						<a class="fb_logon" href="auth.fb.php">login</a>
<?php
}else{
?>
						<a class="fb_logon" href="logout.php">logout</a>
<?php
}
?>
					</div>
				</div>
			</nav>
			<aside class="chatroom float_left">
				<section>
					<div class="chatroom_messages">
						<ul id="js_output" class="list">
						</ul>
					</div>
					<div class="chatroom_input float_clear">
						<input type="hidden" name="token" value="<?php echo (isset($_SESSION['vidol_access_token']))? $_SESSION['vidol_access_token'] : '';?>" />
						<input type="hidden" name="programme" value="" />
						<input type="hidden" name="user" value="" />
						<input type="hidden" name="barrage" value="Y" />
						<input type="hidden" name="video_time" value="0" />
						<input type="hidden" name="position" value="0,0" />
<?php
if($login){
?>
						<input type="text" name="messages" id="input_messages" class="float_left" placeholder="登入發言" disabled="disabled" />
<?php
}else{
?>
						<input type="text" name="messages" id="input_messages" class="float_left" placeholder="輸入發言...">
<?php
}
?>
						<button class="submit float_right">送出</button>
					</div>
				</section>
			</aside>
			<div class="float_clear"></div>
		</article>
		<footer class="float_clear">
		</footer>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js?v=20200101"></script>
		<script src="websocket.event.js?v=20200101"></script>
		<script type="text/javascript">
		$(document).ready(function(){
		});
		</script>
	</body>
</html>
<?php }?>