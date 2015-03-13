<?php
require_once('vendor/autoload.php');

$climate = new League\CLImate\CLImate;

$climate->out('Charcoal Boilerplate Local Database Setup');

$input = $climate->input('What is your database username? ["root"]');
$input->defaultTo('root');
$db_user = $input->prompt();

$input = $climate->input('What is your database password? [""]');
$input->defaultTo('');
$db_password = $input->prompt();

$input = $climate->input('What is your database name?');
$db_name = $input->prompt();
if($db_name == '') {
	$climate->red()->out('Setup aborted. Please enter a database name');
	die();
}

$dsn = 'mysql:dbname='.$db_name;

try {
    $dbh = new PDO($dsn, $db_user, $db_password);
    $climate->out(sprintf('Database %s already exists.', $db_name));
    $input = $climate->bold()->confirm('Do you want to use this database for this project?');
    if ($input->confirmed()) {
    	// ...
    }
    else {
    	$climate->red()->out('Setup aborted.');
    	die();
    }
} 
catch (PDOException $e) {
    $climate->out(sprintf('Database %s does not exist.', $db_name));
    $input = $climate->bold()->confirm('Do you want to create it?');
	if ($input->confirmed()) {
		try {
	        $dbh = new PDO("mysql:", $db_user, $db_password);

	        $res = $dbh->exec("CREATE DATABASE `$db_name`;");
	        if(!$res) {
	        	$climate->red()->out('Setup aborted. Could not create database.');
	       		die();
	        }
	        else {
	        	$climate->green()->out('Database created successfully.');
	        }

	    } 
	    catch (PDOException $e) {
	        $climate->red()->out('Setup aborted. Could not create database.');
	        die();
	    }
	}
	else {
		$climate->red()->out('Setup aborted.');
		die();
	}
}

// If here, DB is created. Setup config.json
$climate->out('Setting up the database for the project...');

$filename = 'www/config/config.json';
if(!file_exists($filename) || !is_writable($filename)) {
	$climate->red()->out('Could not open config.json or file not writeable');
	die();
}
$config = file_get_contents($filename);
$json = json_decode($config, true);

$input = $climate->input('What should the database ident be in the config file? ["local"]');
$input->defaultTo('local');
$db_ident = $input->prompt();

if(!isset($json['databases'])) {
	$json['databases'] = [];
}

$databases = array_keys($json['databases']);
if(in_array($db_ident, $databases)) {
	$input = $climate->bold()->confirm('Database ident already exists in the config file. Overwrite?');
	if (!$input->confirmed()) {
		$climate->red()->out('Setup aborted.');
		die();
	}
}

$json['databases'][$db_ident] = [
	'database' => $db_name,
	'username' => $db_user,
	'password' => $db_password
];

$climate->green()->out('Database added successfully to config file.');

$input = $climate->bold()->confirm(sprintf('Do you want to use "%s" as the default database ident?', $db_name));
if ($input->confirmed()) {
	$json['default_database'] = $db_ident;
}

$config = json_encode($json, JSON_PRETTY_PRINT);
$res = file_put_contents($filename, $config);
if($res === false) {
	$climate->red()->out('Could not write config file. Setup aborted');
}
else {
	$climate->green()->out('Database configuration successful.');
}

