<?php
/**
* Boilerplate Action - Contact
*
* This action handles the "contact" form from the contact template
*
* It validates a CSRF token and create a CMS_Contact object from the POST data.
*
* ## Expected POST values:
* - csrf-token, string - A CSRF token (Charcoal::token() with ident "boilerplate.contact")
* - lastname
* - firstname
* - phone
* - email
* - subject
* - message
* - lang
*
* ## Optional POST values
* - referer, string - The URL to go back to
*
* ## CMS_Contact
* Contacts can be seen in the charcoal backend at url:
* [/admin/object-list-dashboard?obj_type=CMS_Contact]
*
* ## CMS_Contact_Category
* This action is bound to the CMS_Contact_Category object with id=1. This category:
* - Send confirmation email automatically
* - With email template boilerplate.contact-confirmation
* - May have CC and BCC to administratotors
*
* This object can be seen int he charcoal backend at url:
* [/admin/object-edit-dashboard?obj_type=CMS_Contact_Category&obj_id=1]
*
* ## TODOs
* - Support ajax request / json response
*
* @category Boilerplate
* @package Boilerplate.Action
* @subpackage Actions
*
* @author Mathieu Ducharme <mat@locomotive.ca>
* @copyright 2014 Locomotive
* @version 2012-08-01
* @link http://locomotive.ca
* @since Version 2014-07-01
*/


// Get referer
$referer = '';
if(isset($_POST['referer'])) {
	$referer = filter_input(INPUT_POST, 'referer', FILTER_SANITIZE_STRING);
}
else if(isset($_SERVER['HTTP_REFERER'])) {
	$referer = $_SERVER['HTTP_REFERER'];
}
else {
	// None set: Use contact form
	$referer = Charcoal::obj('CMS_Section')->load_from('ident', 'contact')->url();
}

function _header_error($msg='')
{
	global $referer;

	if(headers_sent()) {
		// Error, cant send headers. Should never happened
		die();
	}
	header('Location: '.$referer.'?contact-success=0&msg='.urlencode($msg));
	die();

}

function _header_success($msg='')
{
	global $referer;

	if(headers_sent()) {
		// Error, cant send headers. Should never happened
		die();
	}
	header('Location: '.$referer.'?contact-success=1&msg='.urlencode($msg));
	die();
	die();
}

// Validate CSRF token
$csrf_token = filter_input(INPUT_POST, 'csrf-token', FILTER_SANITIZE_STRING);
if(!Charcoal::token_validate($csrf_token, 'boilerplate.contact')) {
	Charcoal::feedback('error', 'send_contact', _t("Your session has expired. Please try again"));
	_headers_error();
}

// Create and save the Contact object
$contact = Charcoal::obj('CMS_Contact');
$contact->from_flat_data($_POST);
// Hardcoded to the general contact category
$contact->category = 1;

$validations = $contact->validate();
if(!$validations){
	//pre($contact);
	// Saving the contact sends the email confirmatino automatically, according to the category
	$contact_id = $contact->save();
	if($contact_id) {
		_header_success()_t("Successful.");
	}
	else {
		_headers_error(_t("Error saving contact"));
	}
}
else {
	$msg = '';
	foreach($validations as $property=>$messages){
		foreach($messages as $m){
			$msg .= $m.'<br />';
		}
	}

	_headers_error($msg);
}
