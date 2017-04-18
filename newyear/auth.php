<?php
require_once ('config.php');
$data = array ();
$data ['grant_type'] = 'password';
$data ['facebook_token'] = (isset($_POST['facebook_token']))? $_POST['facebook_token'] : false;
$data ['expiration_date'] = (isset($_POST['expiresIn']))? $_POST['expiresIn'] : false;
$data ['user_id'] = (isset($_POST['userID']))? $_POST['userID'] : false;

header('Content-Type: application/json');

if(!empty($data ['facebook_token']) && !empty($data ['expiration_date']) && !empty($data ['user_id'])){
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
		echo $response;
	}
}
