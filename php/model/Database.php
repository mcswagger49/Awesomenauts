<?php
//to create your own object to make variables and use function.  a Class is a blueprint for an object.
class Database {
private $connection;//private means that its only accesible in this file only
private $host; 
private $username;  
private $password; 
private $database; 
public  $error;//public makes it easier to use publiclly 
//variable error to fix other errors

public function __construct($host, $username, $password, $database) {//the local infomation into the function taking the function 
      $this->host = $host;//"this" keyword
      $this->username = $username;
      $this->password = $password;
      $this->database = $database;//passing the infomation to the global info.

      $this->connection = new mysqli($host, $username, $password);//creates the new connection w/ string variables

		if($this->connection->connect_error) {//if statement is checking if there was a connection error
			die("<p>Error: " . $this->connection->connect_error . "</p>");
		}
		else { 
			echo "Success" . $this->connection->host_info;
		}

		$exists = $this->connection->select_db($database);//trys to access the database

		if(!$exists) {// performs commands to exist if it doesn't exist
			$query = $this->connection->query("CREATE DATABASE $database");// a string
			// a statement to tells $database to create a database.
			if($query) {//to output a string
				echo "<p>Successfully created database " . $database . "</p>";//paragraph tags to space out 
	 		}
		}
		else{// makes it execute the database to be completed
			echo "<p>Database Already Exists.</p>";
		}//whole code only runs when the database exists
}

public function openConnection() {//opens the connection in my database
      $this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);

    if  ($this->connection ->connect_error) {//if statement is checking if there was a connection error
	    die("<p>Error: " . $this->connection->connect_error . "</p>");
	}
}

public function closeConnection() {//closes the connection in my database 
	if(isset($this->connection)) {//it is checking the variables has its set or not 
	 $this->connection->close();//checking the closed connection

	}
}

public function query($string) {//calls the variable string into the query
       $this->openConnection();

       $query = $this->connection->query($string);//uses the string to call into the query

       if(!$query) {
            $error = $this->connection->error;//assigning
       }

       $this->closeConnection();

       return $query;//returns the variable querys
	}
}