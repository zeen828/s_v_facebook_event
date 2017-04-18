<?php
require_once ('config.php');
$expiration_time = isset ( $_SESSION ['expiration_time'] ) ? $_SESSION ['expiration_time'] : 0;
if($expiration_time < time ()){
		$login = true;
}else{
		$login = false;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<link rel="shortcut icon" type="image/png" href="http://vidol.tv/assets/favicon-d991863699ba9886821ddf6ad1914a8f67ada3f48ea891c4772d95a69398cfd9.png">
		<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="author" content="Vidol, Sanlih E-Television Co., Ltd.">
		<meta name="description" content="三立新八點華劇《獨家保鑣》來囉！四位演員謝佳見、黃薇渟、洪小鈴、孫沁岳將會與大家見面，與大家分享自己扮演的角色以及故事內容！精彩記者會直播就在Vidol，千萬不要錯過喲！" />
		<meta name="keywords" content="直播, 獨家保鑣, 新聞, 獨家, live" />
		<meta property="og:title" content="special -《獨家保鑣》發佈記者會 - Vidol, Sanlih E-Television Co., Ltd.">
		<meta property="og:description" content="三立新八點華劇《獨家保鑣》來囉！四位演員謝佳見、黃薇渟、洪小鈴、孫沁岳將會與大家見面，與大家分享自己扮演的角色以及故事內容！精彩記者會直播就在Vidol，千萬不要錯過喲！">
		<meta property="og:url" content="<?php echo __URI_META__;?>">
		<meta property="og:image" content="http://special.vidol.tv/V-Focus/images/kv/kv_pc.jpg">
		<meta property="og:type" content="website">
		<meta property="fb:app_id" content="1044817312247946" />
		<title>.</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<link href="assets/css/bootstrap.css" rel="stylesheet">
		<link href="assets/css/font-awesome.css" rel="stylesheet">
		<script type="text/javascript">
		$(document).ready(function(e){
			//解決facebook api登入後url後被加入#_=_
			//http://kuro-sean-blog.logdown.com/posts/712397-after-resolving-the-facebook-api-login-url-is-added-to
			if (window.location.hash && window.location.hash == '#_=_') {
				window.location.hash = '';
				history.pushState('', document.title, window.location.pathname); // nice and clean
			}
		});
		</script>
		<link rel='stylesheet' href='bootstrap-social.css' />
		<style type="text/css">
		body {
				background-color: #c0c0c0;
		}
		</style>
	</head>
	<body>
		<div class="main">
			<div class="fb_login_div">
<?php
if($login){
?>
				<a class="btn btn-block btn-social btn-lg btn-facebook" href="auth.fb.php">
					<i class="fa fa-facebook">
					</i>
					Sign in with Facebook
				</a>
<?php
}else{
?>
				<a class="btn btn-block btn-social btn-lg btn-facebook" href="logout.php">
					<i class="fa fa-facebook">
					</i>
					Logout
				</a>
				<div id="cyclicViewPly"></div>
				<script>
				        function onReady_forVdolPly_cyclicView() {
				            getVdolPly_cyclicView( document.getElementById( 'cyclicViewPly' ), {
				                srcUrl: 'http://c.brightcove.com/services/mobile/streaming/index/rendition.m3u8?assetId=5131652189001',
				            } );
				        }
				</script>
				<script src="/newyear/assets/lib/javascript/vdolPly_cyclicView_integration.js"></script>
<?php
}
?>
			</div>
		</div>
		<div class="echo"></div>
<script>
var app_store_loc = "https://itunes.apple.com/us/app/vidol-taiwan-first-streaming/id1091155189?l=zh&ls=1&mt=8";
var app_loc = "vidol://episodes/15904";
var android_store_loc = "market://details?id=com.set.settv.vidol&hl=zh_TW&utm_source=APP&utm_medium=APP-display&utm_content=GooglePlay&utm_campaign=Recruit";
var android_app_loc = "vidol://episodes?id=15904";
var redirected = false;
if (navigator.userAgent.match(/android/i)) {
	var chromestr = navigator.userAgent;
	var chrome_version_index = chromestr.indexOf("Chrome");
	var chrome_version = chromestr.substr(chrome_version_index+7,4);
	document.cookie = "redirected=true";
	if(chrome_version < 33)
	{
		android_app_loc=android_store_loc;
	}
	//alert('Y1');
	window.location.href=android_app_loc;
	setTimeout(function() {
		//alert('Y2');
		alert("請下載Vidol APP");
		if (!document.webkitHidden && !redirected) {
			//alert('Y3');
			redirected = true;
			window.location = android_store_loc;
		}
	}, 3000);
}
if(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)){
	setTimeout(function() {
		if (!document.webkitHidden) {
			window.location = app_store_loc;
		}
	}, 1000);
	window.location.replace(app_loc);
}
</script>
	</body>
</html>