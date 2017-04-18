<?php
ini_set ( 'display_errors', 'On' ); // On, Off
if(!session_id()) {
	session_start();
}
define ( '__ROOT__', dirname ( __FILE__ ) );
define ( '__LIB_PATH__', dirname ( dirname ( __FILE__ ) ) );
define ( '__DONAME__', $_SERVER ['HTTP_HOST'] );
define ( '__PUTH__', 'newyear' );
define ( '__URI_HOME__', sprintf ( 'http://%s/%s/%s', __DONAME__, __PUTH__, 'index.php' ) );
define ( '__URI_AUTH__', sprintf ( 'http://%s/%s/%s', __DONAME__, __PUTH__, 'auth.fb.php' ) );
define ( '__URI_LOGOUT__', sprintf ( 'http://%s/%s/%s', __DONAME__, __PUTH__, 'logout.php' ) );
define ( '__URI_META__', sprintf ( 'http://%s/%s/', __DONAME__, __PUTH__ ) );
define ( '__FB_ID__', 'FB ID' );
define ( '__FB_SECRET__', 'FB SECRET' );

define ( '__BC_TOKEN__', '' );
define ( '__BC_POST_OAUTH_URL__', '' );
define ( '__BC_GET_PROFILE_URL__', '' );
define ( '__BC_PUT_PROFILE_URL__', '' );

define ( '__VIDEO_TYPE__', '' );
define ( '__VIDEO_ID__', '' );
define ( '__PLAYER_TYPE__', '' );//facebook,youtube,brightcove
define ( '__PLAYER_ID__', '' );
require_once (__LIB_PATH__ . '/Facebook/autoload.php');
?>