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
	static public function init( array $opts = [] )
	{
		// Make sure a session is started at all time. For tokens, some cache, user data, etc.
		if ( ! session_id() ) {
			session_start();
		}

		// Load the request parameters from $_GET
		$action     = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_STRING);
		$section_id = filter_input(INPUT_GET, 's',      FILTER_SANITIZE_STRING);
		$language   = filter_input(INPUT_GET, 'lang',   FILTER_SANITIZE_STRING);

		// Prepare default request options
		$config = Boilerplate_Config::get_latest();

		$defaults = [
			'default_action'  => null,
			'default_section' => null,
			'default_lang'    => null
		];

		$opts = array_merge( $defaults, $opts );

		// If there is no requested "action" or "section_id",
		// we assume the request is for the index.
		if ( ! $action && ! $section_id ) {
			if ( $opts['default_section'] ) {
				$section_id = $opts['default_section'];
			}
			elseif ( $config->default_section ) {
				$section_id = $config->default_section;
			}
		}

		// Resolve the current language
		if ( ! $language || ! in_array( $language, Charcoal::$config['languages'] ) ) {
			if ( $opts['default_lang'] ) {
				$language = $opts['default_lang'];
			}
			elseif ( $config->default_lang ) {
				$language = $config->default_lang;
			}
			elseif ( ! empty(Charcoal::$config['default_language']) ) {
				$language = Charcoal::$config['default_language'];
			}
			else {
				$language = 'fr';
			}
		}

		self::set_language( $language );

		if ( $section_id ) {
			$section_loader = new Charcoal_Object_Loader('CMS_Section');

			$section = $section_loader->{$section_id};

			if ( $section->template ) {
				// What to do?
			}

			$tpl = Charcoal_Template::get($section->template);

			// Section is already loaded, let's tell the controller about it.
			$tpl->controller()->set_section($section);
			echo $tpl->render();
		}
		else if ( $action ) {
			// By action
			\Charcoal::exec($action, $_REQUEST);
		}
		else {
			// By nothing (404 page not found). This should never happen
			die('404');
		}
	}

	/**
	 * Apply the provided language and set locale
	 *
	 * @param string $lang The desired language
	 */

	protected static function set_language( $lang )
	{
		$languages = &Charcoal::$config['languages'];

		$project_name = ( Charcoal::$config['project_name'] ?: 'boilerplate' );

		// Set up the language and the required CSV file
		$l = Charcoal_L10n::get();
		$l->set_lang($lang);
		$l->add_resource_csv($project_name, $lang);

		if ( isset( $languages[ $lang ]['locale'] ) ) {
			$locale = str_replace( '-', '_', $languages[ $lang ]['locale'] );
		}
		else {
			$locale = $lang;
		}

		setlocale( LC_ALL, $locale );
	}
}
