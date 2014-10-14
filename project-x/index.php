<?php
/**
* Default front-end section controller
* Simply delegates initiation to the Boilerplate Module.
*/

// Project configuration and Charcoal instanciation
include 'config/config.php';

// Charcoal init
Charcoal::init();

// Project init (front-page controller)
$opts = [
	'default_section' => Boilerplate_Config::get_latest()->default_section
];
Boilerplate_Module::init($opts);

