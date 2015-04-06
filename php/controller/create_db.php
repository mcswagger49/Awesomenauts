<?php
	require_once(__DIR__ . "/../model/config.php"); //changed to config file because of the new Database class

	$query = $_SESSION["connection"]->query("CREATE TABLE posts ("//create a table in local 
		. "id int(11) NOT NULL AUTO_INCREMENT," //autoincrement is going to give it a name in localhost automaticlly
		. "title varchar(255) NOT NULL,"//the title 
		. "post text NOT NULL,"//posts the text on the website 
		. "DateTime datetime NOT NULL,"//helps posts the datetime on the webpage.
		. "PRIMARY KEY (id))");//the id in primary key 

	if($query) {

		echo "<p>Successfully create table: posts</p>";//shows or echos the text on the website
}

	else {

		echo "<p>" . $_SESSION["connection"]->error. "</p>";
}

		$query = $_SESSION["connection"]->query("CREATE TABLE users("//where the database funciton going to be called
			   .  "id int(11) NOT NULL AUTO_INCREMENT,"//increments the id automaticially
			   .  "username varchar(30) NOT NULL," //stores the username 
			   .  "email varchar(50) NOT NULL,"//stores the email 
			   .  "password char(128) NOT NULL,"//stores the password
			   .  "salt char(128) NOT NULL,"//supposed to stop hackers to get into the query code.
			   .  "PRIMARY KEY (id))");//sets the primary key w/ id

		if ($query) {

			echo "<p>Successfully created table: users</p>";//shows that the tables of users was made.
		}

		else {

			echo "<p>" . $_SESSION["connection"]->error . "</p>";//gives the error if it did not work properly
		}
?>