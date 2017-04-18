<?php
ini_set ( "display_errors", "On" ); // On, Off
try {
	$data_post = array ();
	$data_post ['accessToken'] = (isset ( $_POST ['accessToken'] )) ? $_POST ['accessToken'] : '';
	$data_post ['expiresIn'] = (isset ( $_POST ['expiresIn'] )) ? $_POST ['expiresIn'] : '';
	$data_post ['userID'] = (isset ( $_POST ['userID'] )) ? $_POST ['userID'] : '';
	$data_post ['email'] = (isset ( $_POST ['email'] )) ? $_POST ['email'] : '';
	if (! empty ( $data_post ['accessToken'] ) && ! empty ( $data_post ['expiresIn'] ) && ! empty ( $data_post ['userID'] )) {
		$data = array (
				'grant_type' => 'password',
				'facebook_token' => $data_post ['accessToken'],
				'expiration_date' => $data_post ['expiresIn'],
				'user_id' => $data_post ['userID'],
				'contact_email' => $data_post ['email'],
				'will_test' => 'test' 
		);
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
		//print_r($data_json_token);
// stdClass Object
// (
// 	[access_token] => eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZGVudGl0eSI6eyJpZCI6ODczNzMsInVpZCI6InJ5Y0M5bHBLT3MiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sImFwcGxpY2F0aW9uX2lkIjoxLCJleHBpcmVzX2F0IjoxNDczNDA5ODc4LCJyYW5kX2tleSI6IjdlNTc2ODdmYmM0NDRiODc2ZjQ0OWQzZjY5OTYzODAzIn0.BCEmMyOaSfxH3g8yNeucdGN2HrW-ETeV0j9oSYPfjkYIymmHddyxH3kH6Tss-z2075_n01OI8rM3YW7Qqi4x0Q
// 	[token_type] => bearer
// 	[expires_in] => 172800
// 	[refresh_token] => ddac73227fb3aec5f9bf77a0986541886a0153e65d7aadba5f5b0d2d3f9909f0
// 	[created_at] => 2016-09-07T08:31:18+00:00
// )
		if (! empty ( $data_json_token->access_token ) && ! empty ( $data_json_token->token_type )) {
			// 會員資料
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
			//print_r($data_json_user);
// stdClass Object
// (
// 	[email] =>
// 	[contact_email] => Email
// 	[email_verified] => 1
// 	[profile_image_url] => https://graph.facebook.com/1107054302667151/picture?type=large
// 	[birth_date] => 2016-08-01
// 	[contact_number] => 聯絡電話
// 	[gender] => Male
// 	[nick_name] => Chyan Lu
// 	[occupation] => 職業
// 	[cover_image_url] =>
// 	[username] => tjIXbruzRfSGzmlKOWLfDjRlc
// 	[full_name] => 全名
// 	[address] => 地址
// 	[member_id] => u0tc9T
// )
			header ( "HTTP/1.1 200 OK" );
			header ( 'Content-Type: application/json' );
			echo json_encode ( array (
					'token' => $auth_string,
					'username' => $data_json_user->username,
					'member_id' => $data_json_user->member_id,
					'nick_name' => $data_json_user->nick_name,
					'propic' => $data_json_user->profile_image_url 
			) );
		} else {
			header ( "HTTP/1.1 404 Not Found" );
		}
	} else {
		header ( "HTTP/1.1 404 Not Found" );
	}
} catch ( Exception $e ) {
	echo 'Caught exception: ', $e->getMessage (), "\n";
}
?>