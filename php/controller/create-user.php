<?php
	require_once(__DIR__ . "/../model/config.php");

	$username = filter_input(INPUT_POST,"username", FILTER_SANITIZE_STRING);//ANYTHING THATS NOT STRING IS NOT IMPLEMENTED
	$password = filter_input(INPUT_POST, "password",  FILTER_SANITIZE_STRING);

	$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";//the salt for my password

	$hashedPassword = crypt($password, $salt);

	$query = $_SESSION["connection"]->query("INSERT INTO users SET "//the encrypted password and stored in the database
			. "email = '', "//email value
			. "username = 'username', "//username value
			. "password = '$hashedPassword', "//password value
			. "salt = '$salt', "
			. "exp = 0, "
			. "exp1 = 0, "
			. "exp2 = 0, "
			. "exp3 = 0, "
			. "exp4 = 0,");

	$_SESSION["name"] = $username; 
	
	if ($query) {
		//used this for Ajax on index.php
		echo "true";
	}
	 else {
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}
	






