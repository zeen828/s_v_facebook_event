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
<!DOCTYPE html>
<html>
	<head>
		<title>聊天室</title>
		<meta charset="utf-8">
		<meta http-equiv="Cache-control" content="public">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/themes/smoothness/jquery-ui.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.0/jquery-ui.min.js"></script>
		<script src="facebook.auth.js?v=<?php echo time();?>"></script>
		<script src="websocket.event.js?v=<?php echo time();?>"></script>
		<style type="text/css">
		.list li{
			/*去除點點*/
			list-style-type:none;
		}
		.img_round {
			width : 25px;
			height : 25px;
			-webkit-border-radius : 25px;
			-moz-border-radius : 25px;
			border-radius : 25px;
		}
		/*聊天室*/
		.chatroom_messages {
			overflow:scroll;
			/*height:200px;*/
			min-height:550px;
			max-height:550px;
			border:solid 0px #aaa;
			margin:0 auto;
			overflow-x:hidden;
			/*overflow-y:hidden;*/
		}
		.chatroom_messages ul {
			-webkit-padding-start: 10px;
		}

		</style>
		<script type="text/javascript">
		$(document).ready(function(){
		});
		</script>
	</head>
	<body>
		<section data-role="page" id="index">
			<div data-role="panel" id="chatroom" data-position="left"> 
				<h2>聊天室設定</h2>
				<span>
					<label for="fname" class="ui-hidden-accessible">影音類型：</label>
					<select name="video_type" data-mini="true">
						<option value="channel">channel</option>
						<option value="episode">episode</option>
						<option value="live">live</option>
						<option value="event">event</option>
						<option value="forum">forum</option>
					</select>
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">影音編號：</label>
					<input type="text" name="video_id" value="1" placeholder="影音編號...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">節目編號：</label>
					<input type="text" name="programme" value="" placeholder="節目編號...">
				</span>
				<span>
					<input type="button" class="connection" data-inline="true" value="連線">
				</span>
				<span>
					<input type="button" class="close" data-inline="true" value="斷線">
				</span>
			</div>
			<div data-role="panel" id="user" data-position="right"> 
				<h2>使用者資料</h2>
				<span>
					<div class="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="true" onlogin="fb_status();" scope="public_profile,email"></div>
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">會員ID：</label>
					<input type="text" name="member_id" value="<?php echo (isset($_SESSION['vidol_member_id']))? $_SESSION['vidol_member_id'] : '';?>" placeholder="會員ID...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">會員暱稱：</label>
					<input type="text" name="nick_name" value="<?php echo (isset($_SESSION['vidol_nick_name']))? $_SESSION['vidol_nick_name'] : '';?>" placeholder="會員暱稱...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">會員照片：</label>
					<input type="text" name="propic" value="<?php echo (isset($_SESSION['vidol_propic']))? $_SESSION['vidol_propic'] : '';?>" placeholder="會員照片...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">TOKEN：</label>
					<input type="text" name="token" value="<?php echo (isset($_SESSION['vidol_access_token']))? $_SESSION['vidol_access_token'] : '';?>" placeholder="TOKEN...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">會員：</label>
					<input type="text" name="user" value="" placeholder="會員...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">彈幕：</label>
					<input type="text" name="barrage" value="Y" placeholder="彈幕...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">影片時間：</label>
					<input type="text" name="video_time" value="0" placeholder="影片時間...">
				</span>
				<span>
					<label for="fname" class="ui-hidden-accessible">位置：</label>
					<input type="text" name="position" value="0,0" placeholder="位置...">
				</span>
			</div> 
			<header data-role="header" data-position="fixed">
				<a href="#chatroom" class="ui-btn ui-icon-gear ui-btn-icon-left">聊天室</a>
				<a href="#user" class="ui-btn ui-icon-bars ui-btn-icon-right">使用者</a>
				<h1>聊天室</h1>
			</header>
			<article data-role="content">
				<aside>
					<div class="ws_count">
						在線人數:<span class="count">0</span>
					</div>
					<div class="chatroom_messages">
						<ul id="js_output" class="list">
						</ul>
					</div>
				</aside>
			</article>
			<footer data-role="footer" data-position="fixed">
				<div data-role="navbar">
					<ul>
						<li><input type="text" name="messages" id="input_messages" value="" placeholder="訊息..."></li>
					</ul>
				</div>
			</footer>
		</section>
	</body>
</html>
<?php }?>