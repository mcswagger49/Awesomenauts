<?php
//stores infomation 
	require_once(__DIR__ . "/Database.php");
	session_regenerate_id(true);//gives a session a id and deletes the old session
	session_start();//starts session

    $path = "/Awesomenauts/php/";//a new path variable

	$host = "localhost";// the variable host
	$username = "root";//the variable username 
	$password = "root";//the variable password
	$database = "awesomenauts_db";//the variable database

	if(!isset($_SESSION["connection"])) {//checks it the variable is set on not.
		$connection = new Database($host, $username, $password, $database);
		$_SESSION["connection"] = $connection;//access the session variable throughout all the webpages.
}