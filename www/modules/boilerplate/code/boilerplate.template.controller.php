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
class Boilerplate_Template_Controller extends Charcoal_Template_Controller
{
	/**
	* Keep a copy of the current section
	*/
	private $_section;
	/**
	* Keep a copy of the Section Object loader
	* @var \Charcoal_Object_Loader
	*/
	private $_sections_loader;
	/**
	* Keep a copy of the Template loader
	* @var \Charcoal\Template_Loader
	*/
	private $_templates_loader;
	/**
	* Keep a copy of the Widget Loader
	* @var \Charcoal\Widget_Loader
	*/
	private $_widgets_loader;

	/**
	* Get the current project's main module
	*
	* @return string
	*/
	public function module()
	{
		return 'boilerplate';
	}


	/**
	* Sets the section to something when there is
	* no "s" get parameter and we still wanna use this
	*
	* @see Cocqsac_module::init()
	* @param $section CMS_Section Object
	* @return this (chainable)
	*/
	public function set_section( $section )
	{
		$this->_section = $section;

		return $this;
	}


	/**
	* Get the current
	* (Previously, this would have been `Charcoal::$vars['section']`)
	*
	* @return CMS_Section
	*/
	public function section()
	{
		if(isset($this->_section)) {
			return $this->_section;
		}

		$section_id = isset($_GET['s']) ? filter_input(INPUT_GET, 's', FILTER_SANITIZE_STRING) : '';
		$section = \Charcoal::obj('CMS_Section');
		if($section_id) {
			$section->load($section_id);
		}
		$this->_section = $section;
		return $section;
	}

	/**
	* Get a `CMS_Section` Object Loader
	*
	* - Use "ident" as a key, so it can be called with {{sections.ident}}
	* - Cache the result, so this almost never touches the DB.
	*
	* ## The `\Charcoal_Object_Loader` object
	* Read the documentation on `\Charcoal_Object_Loader` for more details.
	* In short, it allows to call the objects with `->texts()->ident;` // `{{sections.ident}}` to return (and load on-the-fly, if required)
	* the `CMS_Text` object with the `ident` "ident".
	*
	* @return \Charcoal\Object_Loader
	* @see CMS_Section
	*/
	public function sections()
	{
		if(!$this->_sections_loader) {
			// Load the object, if it was not.
			$this->_sections_loader = new \Charcoal_Object_Loader('CMS_Section', 'ident', 'cache');
		}

		return $this->_sections_loader;
	}

	/**
	* Get a "CMS_Text" Object Loader
	* - Use "ident" as a key, so it can be called with {{sections.ident}}
	* - Cache the result, so this almost never touches the DB.
	*
	* ## The `\Charcoal_Object_Loader` object
	* Read the documentation on `\Charcoal_Object_Loader` for more details.
	* In short, it allows to call the objects with `->sections()->ident;` to return (and load on-the-fly, if required)
	* the `CMS_Section` object with the `ident` "ident".
	*
	* @return \Charcoal\Object_Loader
	* @see CMS_Text
	*/
	public function texts()
	{
		if(!$this->_texts_loader) {
			// Load the (text loader) object, if it was not.
			$this->_texts_loader = new \Charcoal_Object_Loader('CMS_Text', 'ident', 'cache');
		}

		return $this->_texts_loader;
	}

	/**
	* Get the latest Config instance from DB / cache
	*
	* @return Config
	*/
	public function cfg()
	{
		return Boilerplate_Config::get_latest();
	}

	/**
	* Return the base URL
	* Previously, this would have been `Charcoal::$config['URL']` (which still works)
	*
	* @return string
	*/
	public function URL()
	{
		return \Charcoal::$config['URL'];
	}

	/**
	* Return the current URL
	*
	* @return string
	*/
	public function current_url()
	{
		return Charcoal::$config['HTTP_MODE'] . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
	}

	/**
	* Test templating.
	*
	* Allow to hide content under dev_mode
	*
	* @return boolean
	*/
	public function dev_mode()
	{
		return false;
	}

	/**
	* Returns the current language (2-character / ISO-639-1)
	*
	* @return string
	*/
	public function lang()
	{
		return _l();
	}

	/**
	* Assets getters
	*
	* This method returns an array of lambda functions, which in turn takes the argument
	*
	* ## Using with mustache
	* In short, this allows to get an asset with the following mustache tag:
	* - `{{#assets.images}}test.png{{/assets.images}}
	*
	* ## Asset types
	* - images
	* - styles
	* - scripts
	* - fonts
	* - files
	* Read the documentation on \Charcoal\Asset for more details on how assets are loaded relative to the filesystem.
	*
	* @return array
	* @see \Charcoal\Asset
	*/
	public function assets($asset_mode='url')
	{
		$ret = [
			'images' => function($txt) use ($asset_mode) {
				return new \Charcoal\Asset('images', $txt, $asset_mode);
			},
			'styles' => function($txt) use ($asset_mode) {
				return new \Charcoal\Asset('styles', $txt, $asset_mode);
			},
			'scripts' => function($txt) use ($asset_mode) {
				return new \Charcoal\Asset('scripts', $txt, $asset_mode);
			},
			'fonts' => function($txt) use ($asset_mode) {
				return new \Charcoal\Asset('fonts', $txt, $asset_mode);
			},
			'files' => function($txt) use ($asset_mode) {
				return new \Charcoal\Asset('files', $txt, $asset_mode);
			}
		];

		return $ret;
	}

	/**
	* Get the proper name of the template, usable for css class.
	*
	* (Replace invalid characters, such as a dot.)
	*
	* @return string
	*/
	public function template_class()
	{
		$token = $this->section()->template;
		$search = ["boilerplate_"];
		$replace = [""];
        $token = str_replace(".", "_", $token);

	    if ( is_numeric($token) ) {
	        $token = preg_replace('/\D+/', '', $token);
	    }
	    else {
	        $token = str_replace($search, $replace,$token);
	        $token = preg_replace('/[^\w-]/', '', strtolower($token));
	    }

	    return $token;
	}
}
