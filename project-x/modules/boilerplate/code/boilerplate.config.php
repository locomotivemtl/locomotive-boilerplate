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
* Boilerplate configuration
*
* The latest (current) object can always be used by calling:
* ```php
* $cfg = \Boilerplate\Config::get_latest();
* ```
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
class Boilerplate_Config extends \Charcoal_Object
{
	/**
	* Google Analytics code
	* @var string $google_analytics
	* @see Property_String
	*/
	public $google_analytics;

	/**
	* Default section
	* The section to load when reaching the default base URL.
	* Also, usually the section to load when clicking on the main link / logo
	* @var mixed $default_section
	* @see Property_Object
	* @see CMS_Section
	*/
	public $default_section;
	/**
	* Default lang
	* @var string $default_lang
	* @see Property_Lang
	*/
	public $default_lang;

	/**
	* URL of the related facebook page
	* @var string $social_facebook_url
	* @see Property_Url
	*/
	public $social_facebook_url;
	/**
	* URL of the related twitter account
	* @var string $social_twitter_url
	* @see Property_Url
	*/
	public $social_twitter_url;
	/**
	* URL of the related google+ page
	* @var string $social_facebook_url
	* @see Property_Url
	*/
	public $social_google_url;
	/**
	* URL of the related instagram page
	* @var string $social_instagram_url
	* @see Property_Url
	*/
	public $social_instagram_url;
	/**
	* URL of the related flickr page
	* @var string $social_flickr_url
	* @see Property_Url
	*/
	public $social_flickr_url;
	/**
	* URL of the related youtube page
	* @var string $social_youtube_url
	* @see Property_Url
	*/
	public $social_youtube_url;

	/**
	* Default title, if none is specified
	* - l10n: true
	* @var mixed $meta_default_title
	* @see Property_String
	*/
	public $meta_default_title;
	/**
	* Default title, if none is specified
	* - l10n: true
	* @var mixed $meta_default_prefix
	* @see Property_String
	*/
	public $meta_title_prefix;
	/**
	* Default title, if none is specified
	* - l10n: true
	* @var mixed $meta_default_suffix
	* @see Property_String
	*/
	public $meta_title_suffix;
	/**
	* Default title, if none is specified
	* - l10n: true
	* @var mixed $meta_default_description
	* @see Property_Text
	*/
	public $meta_default_description;
	/**
	* Default title, if none is specified
	* - l10n: true
	* - upload_path: "uploads/config/meta_image/"
	* @var mixed $meta_default_image
	* @see Property_Image
	*/
	public $meta_default_image;
	/**
	* Default meta-keywords, if none is specified
	* - l10n: true
	* - multiple: true
	* @var mixed $meta_default_keywords
	* @see Property_String
	*/
	public $meta_default_keywords;

	/**
	* Static getter of the latest config
	*
	* This is the preferred way of loading the Configuration object.
	*
	* It will only be loaded 1 time from the configuration, otherwie, it will be stored
	* in a static variable.
	*
	* @return static Corim_Config
	* @todo Use APC instead of static, if available
	*/
	static public function get_latest()
	{
		static $_cached;

		$cache_key = 'latest_boilerplate_config';

		if($_cached instanceof self) {
			// Load from static if possible
			return $_cached;
		}
		else {
			// Load from DB otherwise
			$_cached = Charcoal::obj( __CLASS__ );
			$_cached->load_latest();
			return $_cached;
		}
	}

	/**
	* @return Corim_Config
	*/
	public function load_latest()
	{
		// Hardcoded to ID 1
		$this->load_key('id', 1);

		// Chainable
		return $this;
	}
}