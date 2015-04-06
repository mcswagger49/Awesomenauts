<?php
	require_once(__DIR__ . "/../model/config.php"); //changed to config file because of the new Database class

		$query = $_SESSION["connection"]->query("CREATE TABLE users("//where the database funciton going to be called
			   .  "id int(11) NOT NULL AUTO_INCREMENT,"//increments the id automaticially
			   .  "username varchar(30) NOT NULL," //stores the username 
			   .  "email varchar(50) NOT NULL,"//stores the email 
			   .  "password char(128) NOT NULL,"//stores the password
			   .  "salt char(128) NOT NULL,"//supposed to stop hackers to get into the query code.
			   .  "exp int(4),"
			   .  "exp1 int(4),"
			   .  "exp2 int(4),"
			   .  "exp3 int(4),"
			   .  "exp4 int(4),"
			   .  "PRIMARY KEY (id))");//sets the primary key w/ id
?>