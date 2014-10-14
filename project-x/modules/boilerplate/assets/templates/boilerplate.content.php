<?php
/**
*
* @category Boilerplate
* @package Boilerplate.Templates
* @subpackage Templates
*
* @author Mathieu Ducharme <mat@locomotive.ca>
* @copyright 2014 Locomotive
* @version 2014-10-01
* @link http://locomotive.ca
* @since Version 2014-10-01
*/

?>
{{>boilerplate.inc.header}}

<section class="content {{section.ident}}">

	<h1>{{section.p.title}}</h1>
	<h2>{{section.p.subtitle}}</h2>

	<div class="section-summary">
		{{section.p.summary.display}}
	</div>
	
	<div class="section-description">
		{{section.p.content.display}}
	</div>
	

</section>

{{>boilerplate.inc.footer}}

