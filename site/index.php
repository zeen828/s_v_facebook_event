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
    <title> special - 完全娛樂 Live - Vidol, Sanlih E-Television Co., Ltd.</title>
    <link rel='stylesheet' href='stylesheets/index.css' />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script type="text/javascript" src="javascripts/share.js"></script>
    <script type="text/javascript" src="javascripts/sunscroll.js"></script>
    <script type="text/javascript" src="javascripts/listUl.js"></script>
    <script type="text/javascript" src="javascripts/websocket.event.js"></script>
    <script async='async' src='https://www.googletagservices.com/tag/js/gpt.js'></script>
    <style type="text/css">
    #wrapper>.content>.in>.right .memberOnline .login {
        background-color: #3c56a1;
        position: absolute;
        right: 0px;
        top: 0px;
        color: #fff;
        text-decoration: none;
    }
    </style>
  </head>
  <body>
    <div class="loading"></div>
    <!-- 資料 -->
    <input type="hidden" name="token" value="<?php echo (isset($_SESSION['vidol_access_token']))? $_SESSION['vidol_access_token'] : '';?>" />
    <input type="hidden" name="programme" value="" />
    <input type="hidden" name="video_type" value="<?php echo __VIDEO_TYPE__;?>" />
    <input type="hidden" name="video_id" value="<?php echo __VIDEO_ID__;?>" />
    <input type="hidden" name="user" value="" />
    <input type="hidden" name="member_id" value="<?php echo (isset($_SESSION['vidol_member_id']))? $_SESSION['vidol_member_id'] : '';?>" />
    <input type="hidden" name="nick_name" value="<?php echo (isset($_SESSION['vidol_nick_name']))? $_SESSION['vidol_nick_name'] : '';?>" />
    <input type="hidden" name="propic" value="<?php echo (isset($_SESSION['vidol_propic']))? $_SESSION['vidol_propic'] : '';?>" />
    <input type="hidden" name="barrage" value="Y" />
    <input type="hidden" name="video_time" value="0" />
    <input type="hidden" name="position" value="0,0" />
    <!-- 頁頭 -->
    <header>
      <!-- vidol logo -->
      <div id="logo" style="background-image:url(images/logo.svg) !important;"><a href="http://vidol.tv"></a></div>
      <!-- 選單 Switch：false(關) true(開) -->
      <nav switch="false">
        <div id="vice1" class="horizontalScroll">
          <ul>
            <li><a href="#">2016/09/25 星期日</a></li>
            <li class="active"><a href="#">2016/09/26 星期一</a></li>
            <li><a href="#">2016/09/27 星期二</a></li>
            <li><a href="#">2016/09/28 星期三</a></li>
            <li><a href="#">2016/09/29 星期四</a></li>
            <li><a href="#">2016/09/30 星期五</a></li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- 中央內容 -->
    <article class="content">
      <!-- 上方欄位 主視覺區塊 Switch：false(關) true(開) -->
      <div class="top" switch="ture">
        <!-- pc:1280x450 pad:720x250 mobile:600x120 -->
        <span class="img" pc="images/kv/kv_pc.jpg" pad="images/kv/kv_pad.jpg" mobile="images/kv/kv_mobile.jpg" alt="test" title="完全娛樂 Live" url=""></span>
      </div>
      <!-- 左邊欄位 Switch：false(關) true(開) -->
      <div class="left" switch="false"></div>
      <!-- 中間欄位 Switch：false(關) true(開) -->
      <div class="center" switch="ture">
        <!-- <div class="top" videoStatus="fblive">-->
        <div class="top" videoStatus="">
<?php
switch(__PLAYER_TYPE__){
    case 'facebook':
?>
          <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F<?php echo __PLAYER_ID__;?>&width=613&show_text=false&appId=1044817312247946&height=345" width="auto" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
<?php
        break;
    case 'youtube':
?>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/<?php echo __PLAYER_ID__;?>?modestbranding=1&rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>
<?php
        break;
    case 'brightcove':
?>
          <div style="display: block; position: relative; max-width: 100%;"><div style="padding-top: 56.25%;">
          <video data-video-id="<?php echo __PLAYER_ID__;?>"
          autoplay
          data-account="4338955585001"
          data-player="VJxyQW4m0e"
          data-embed="default"
          data-application-id
          class="video-js"
          controls
          style="width: 100%; height: 100%; position: absolute; top: 0px; bottom: 0px; right: 0px; left: 0px;"></video>
          <script src="//players.brightcove.net/4338955585001/VJxyQW4m0e_default/index.min.js"></script></div></div>
<?php
        break;
}
?>
        </div>
        <div class="con">
          <!-- 廣告區塊 Switch：false(關) true(開) 可複製bannerAll區塊多次使用 需有3尺寸-->
          <div class="bannerAll" switch="false">
            <ul class="bannerUl">
              <li size="728x90">
              </li>
              <li size="468x60 pad">
              </li>
              <li size="320X50">
              </li>
            </ul>
          </div>
          <h2>《獨家保鑣》發佈記者會 </h2>
          <p>三立新八點華劇《獨家保鑣》來囉！四位演員謝佳見、黃薇渟、洪小鈴、孫沁岳將會與大家見面，與大家分享自己扮演的角色以及故事內容！精彩記者會直播就在Vidol，千萬不要錯過喲！</p>
        </div>
      </div>
      <!-- 右邊欄位 Switch：false(關) true(開) -->
      <div class="right" switch="ture">
        <div class="memberOnline">
          <span class="label">在線人數:</span>
          <span class="count">0</span>
          <div class="out" id="fb-root">
<?php
if($login){
?>
            <a class="login" href="auth.fb.php">login</a>
<?php
}else{
?>
            <a class="login" href="logout.php">logout</a>
<?php
}
?>
        </div>
          <span class="label">vidol粉絲團:</span>
          <div class="fb-like" data-href="https://www.facebook.com/vidol.tv/?fref=ts" data-layout="button_count" data-action="like" data-size="small" data-show-faces="false" data-share="false"></div>
        </div>
        <div id="nav" class="scrollBlock">
          <ul class="messageUl" model="model1"></ul>
        </div>
<?php
if($login){
?>
        <input type="text" name="messages" id="input_messages" placeholder="登入發言" disabled="disabled" />
<?php
}else{
?>
        <input type="text" name="messages" id="input_messages" placeholder="輸入發言...">
<?php
}
?>
        <button class="submit">送出</button>
      </div>
      <!-- 下方欄位 Switch：false(關) true(開) -->
      <div class="bottom" switch="false"></div>
    </article>
    <!-- 頁尾 -->
    <footer>
      <!-- pc:1280x150 pad:720x120 mobile:600x120 -->
      <span class="img" pc="images/footer/pc.png" pad="images/footer/pad.png" mobile="images/footer/mobile.png" alt="test" title="test1" url=""></span>
    </footer>
  </body>
</html>