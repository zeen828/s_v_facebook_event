<?php
require_once ('config.php');

$_SESSION['fb_login_url'] = '#';
$_SESSION['fb_logout_url'] = '#';

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
		// FB token
		$_SESSION['fb_access_token'] = $accessToken;
		// 登出網址
		$_SESSION['fb_logout_url'] = sprintf ( 'https://www.facebook.com/logout.php?access_token=%s&next=%s', $accessToken->getValue (), urlencode ( __URI_HOME__ ) );
		// FB取得用戶基本資料
		$response = $fb->get ( '/me?fields=id,name,first_name,last_name,age_range,link,gender,locale,timezone,verified,email,birthday,location', $accessToken );
		$fb_user = $response->getGraphUser ();
		// 莫名其妙不列印無法取得值
		print_r($fb_user, true);
		$fb_Birthday = $fb_user->getBirthday ();
		$fb_Location = $fb_user->getLocation ();
		// vidol SESSION時效
		$expiration_time = isset ( $_SESSION ['expiration_time'] ) ? $_SESSION ['expiration_time'] : 0;
		if ($fb_user ['id'] && $expiration_time < time ()) {
			$_SESSION['fb_id'] = $fb_user ['id'];
			// vidol登入/註冊
			$data = array ();
			$data ['grant_type'] = 'password';
			$data ['facebook_token'] = $accessToken->getValue ();
			$data ['expiration_date'] = $accessToken->getExpiresAt ();
			$data ['user_id'] = $fb_user ['id'];
			$data ['nick_name'] = ($fb_user ['name']) ? $fb_user ['name'] : '';
			$data ['contact_email'] = (isset($fb_user ['email'])) ? $fb_user ['email'] : '';
			$data ['gender'] = (isset($fb_user ['gender'])) ? $fb_user ['gender'] : '';
			$data ['birth_date'] = (isset($fb_Birthday->date)) ? $fb_Birthday->date : '';
			$data ['address'] = (isset($fb_Location ['name'])) ? $fb_Location ['name'] : '';
			$request = __BC_POST_OAUTH_URL__;
			$ch = curl_init ( $request );
			curl_setopt_array ( $ch, array (
					CURLOPT_POST => TRUE,
					CURLOPT_RETURNTRANSFER => TRUE,
					CURLOPT_TIMEOUT_MS => 1000,
					CURLOPT_SSL_VERIFYPEER => FALSE,
					CURLOPT_HTTPHEADER => array (
							'Content-Type: application/json',
							'Authorization: ' . __BC_TOKEN__ 
					),
					CURLOPT_POSTFIELDS => json_encode ( $data ) 
			) );
			$response = curl_exec ( $ch );
			curl_close ( $ch );
			$data_json_token = json_decode ( $response );
			//print_r($data_json_token);
			// vidol登入/註冊成功
			if (! empty ( $data_json_token->access_token ) && ! empty ( $data_json_token->token_type )) {
				$auth_string = sprintf ( '%s %s', $data_json_token->token_type, $data_json_token->access_token );
				$request = __BC_GET_PROFILE_URL__;
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
				//print_r($data_json_user);
				// vidolo補資料
				if(!isset ( $data_json_user->contact_email ) || !isset ( $data_json_user->nick_name ) || !isset ( $data_json_user->gender ) || !isset ( $data_json_user->birth_date ) || !isset ( $data_json_user->address )){
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
						$data ['birth_date'] = (isset($fb_Birthday->date)) ? mb_substr($fb_Birthday->date, 0, 10, 'UTF-8') : '';
					}
					if(!isset ( $data_json_user->address )){
						$data ['address'] = (isset($fb_Location ['name'])) ? $fb_Location ['name'] : '';
					}
					$request = __BC_PUT_PROFILE_URL__;
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
				if (isset ( $data_json_user->member_id )) {
					$_SESSION ['expiration_time'] = strtotime ( $data_json_token->created_at . '+' . $data_json_token->expires_in . ' sec' );
					$_SESSION ['vidol_access_token'] = sprintf ( '%s %s', $data_json_token->token_type, $data_json_token->access_token );
					$_SESSION ['vidol_member_id'] = $data_json_user->member_id;
					$_SESSION ['vidol_nick_name'] = $data_json_user->nick_name;
					$_SESSION ['vidol_propic'] = str_replace ('?type=large', '?type=small', $data_json_user->profile_image_url);
					header ( 'Location: ' . __URI_HOME__ );
					//echo 'A:', __URI_HOME__, '<br/>';
				}
			}
		}
	} catch ( Facebook\Exceptions\FacebookResponseException $e ) {
		echo 'Graph returned an error: ' . $e->getMessage ();
	} catch ( Facebook\Exceptions\FacebookSDKException $e ) {
		echo 'Facebook SDK returned an error: ' . $e->getMessage ();
	}
} else {
	$_SESSION['fb_login_url'] = $helper->getLoginUrl ( __URI_AUTH__, [ 
			'email',
			'user_birthday',
			'user_location' 
	] );
	header ( 'Location: ' . $_SESSION['fb_login_url'] );
	//echo 'B:', $_SESSION['fb_login_url'], '<br/>';
}
?>