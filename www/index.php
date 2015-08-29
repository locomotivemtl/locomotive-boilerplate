<?php

/**
 * Project Controller
 *
 * Delegates startup to the Boilerplate's Module.
 *
 * @package Charcoal\Boilerplate
 */

/** Import configuration and setup environment */
include dirname(__DIR__) . '/config/config.php';

/** Initialize Charcoal */
Charcoal::init();

/** Initialize Boilerplate */
Boilerplate_Module::init();
