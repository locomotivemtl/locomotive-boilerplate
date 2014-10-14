<?php
/**
* config.php
*/

// Error reporting
error_reporting(E_ALL & ~E_STRICT);
ini_set('display_errors', true);

// Environment defaults
date_default_timezone_set('America/Montreal');

// Main Charcoal include. This is where the Charcoal autoloader is defined.
include __DIR__.'/../charcoal/charcoal.php';

// JSON Configuration
Charcoal::add_config(__DIR__.'/config.json');

// Configuration overwrite
Charcoal::$config['ROOT'] = realpath(__DIR__).'/../';
Charcoal::$config['URL'] = 'http://'.$_SERVER['HTTP_HOST'].'/';

