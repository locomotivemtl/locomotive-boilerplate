<?php
/**
* config.php
*/

// Error reporting
error_reporting(E_ALL & ~E_STRICT);
ini_set('display_errors', true);



// Main Charcoal include. This is where the Charcoal autoloader is defined.
include __DIR__.'/../charcoal/charcoal.php';

// JSON Configuration
Charcoal::add_config(__DIR__.'/config.json');
$application_env = Charcoal::application_env();
if(file_exists(__DIR__ . '/config.'.$application_env.'.json')) {
	Charcoal::add_config(__DIR__ . '/config.'.$application_env.'.json');
}

// Environment defaults
date_default_timezone_set('America/Montreal');

// Configuration overwrite
Charcoal::$config['ROOT'] = realpath(__DIR__).'/../';
if(isset($_SERVER['HTTP_HOST'])) {
	Charcoal::$config['URL'] = 'http://'.$_SERVER['HTTP_HOST'].'/';
}
else {
	Charcoal::$config['URL'] = 'http://localhost/';
}

