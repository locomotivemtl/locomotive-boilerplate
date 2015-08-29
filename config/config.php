<?php

/**
 * Charcoal Configuration
 *
 * @package Charcoal\Boilerplate
 */

error_reporting(E_ALL & ~E_STRICT);

/**
 * Register the Composer auto loader
 */

require dirname(__DIR__) . '/vendor/autoload.php';

/**
 * Configure Application
 */

Charcoal::add_config(__DIR__ . '/config.json');

$application_env   = Charcoal::application_env();
$env_configuration = __DIR__ . "/config.{$application_env}.json";
if (file_exists($env_configuration) ) {
	Charcoal::add_config($env_configuration);
}

/**
 * Setup Timezone
 */

date_default_timezone_set( Charcoal::$config['default_timezone'] ?: 'America/Montreal' );

/**
 * Setup Debugging
 */

$debug_application = ( isset(Charcoal::$config['debug']['active']) && Charcoal::$config['debug']['active'] ? true : false );
ini_set('display_errors', $debug_application);

/**
 * Resolve Locations
 */

Charcoal::$config['ROOT'] = rtrim( realpath( dirname(__DIR__) . '/www' ), '/\\' ) . '/';

$php_sapi = php_sapi_name();

if ( substr($php_sapi, 0, 3) !== 'cli' ) {
	$name = ( Charcoal::$config['project_name'] ?: 'boilerplate' );
	$http = ( Charcoal::$config['HTTP_MODE'] ?: '//' );
	$host = ( getenv('HTTP_HOST') ?: 'localhost' );
	$url  = '';

	if ( empty(Charcoal::$config['project_url']) ) {
		$url = $host;

		$is_local = preg_match('#^(localhost|(127|192)\.\d{1,3}\.\d{1,3}\.\d{1,3})$#', $host);

		/** Make an assumption about localhost environments */
		if ( $is_local && false === strpos($url, $name) ) {
			$url .= '/' . $name;
		}
	} else {
		$search  = [ '#\[\[http|protocol|scheme\]\]#', '#\[\[host|server|domain\]\]#', '#\[\[(project|name)\]\]#' ];
		$replace = [ $http, $host, $name ];

		$url = preg_replace($search, $replace, Charcoal::$config['project_url']);
	}

	/** Clean up any typos and undesirables characters */
	$url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
	$url = str_replace(';//', '://', $url);

	/**
	 * If the URL doesn't appear to contain a scheme name, we must
	 * presume it needs http:// prepended to the URL (unless it's
	 * a relative link starting with /, # or ? or a PHP file).
	 */
	if ( strpos($url, ':') === false && ! in_array($url[0], [ '/', '#', '?' ]) && ! preg_match('/^[a-z0-9-]+?\.php/i', $url) ) {
		$url = $http . $url;
	}

	Charcoal::$config['URL'] = rtrim($url, '/\\') . '/';
}
