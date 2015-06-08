<?php
/**
* @category Boilerplate
* @package Boilerplate.Objects
* @subpackage Objects
*
* @author Mathieu Ducharme <mat@locomotive.ca>
* @copyright 2014 Locomotive
* @version 2014-10-01
* @link http://locomotive.ca
* @since Version 2014-10-01
*/


/**
* The Boilerplate Module class
*
* @category Boilerplate
* @package Boilerplate.Objects
* @subpackage Objects
*
* @author Mathieu Ducharme <mat@locomotive.ca>
* @copyright 2014 Locomotive
* @version 2014-10-01
* @link http://locomotive.ca
* @since Version 2014-10-01
*/
class Boilerplate_Module extends Charcoal_Module
{
	/**
	* Module initialisation
	*
	* This function should act as both the initialization of the module and the front-page main controller.
	*
	* ## Options
	* - default_action
	* - default_section
	* - default_lang
	*
	* @param array $opts
	*
	* @return null
	*/
	static public function init($opts=null)
	{
		// Make sure a session is started at all time. For tokens, some cache, user data, etc.
		if (!session_id()) {
			session_start();
		}

		// Get the latest configuration
		$default_action = isset($opts['default_action']) ? $opts['default_action'] : '';
		$default_section_id = isset($opts['default_section']) ? $opts['default_section'] : 0;
		$default_lang = isset($opts['default_lang']) ? $opts['default_lang'] : 'fr';

		// Load the action or section from the $_GET
		$action = isset($_GET['action']) ?  filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING) : $default_action;
		$section_id = isset($_GET['s']) ?  filter_input(INPUT_GET, 's', FILTER_SANITIZE_STRING) : $default_section_id;

		// Set up the language and the required CSV file
		$lang = isset($_GET['lang']) ? filter_input(INPUT_GET, 'lang', FILTER_SANITIZE_STRING) : $default_lang;
		$l = Charcoal_L10n::get();
		$l->set_lang($lang);
		$l->add_resource_csv('boilerplate', $lang);

		if($section_id) {
			// By section
			$section_loader = new Charcoal_Object_Loader('CMS_Section');

			$section = $section_loader->{$section_id};

			if($section->template) {
				// What to do?
			}

			$tpl = Charcoal_Template::get($section->template);

			// Section is already loaded, let's tell the controller about it.
			$tpl->controller()->set_section( $section );
			echo $tpl->render();
		}
		else if($action) {
			// By action
			\Charcoal::exec($action, $_REQUEST);
		}
		else {
			// By nothing (404 page not found). This should never happen
			die('404');
		}
	}
}
