<?php
    if(!defined("__ZBXE__")) exit();

    if($called_position == 'before_display_content' && !Context::get('module') && Context::getResponseMethod() == 'HTML') {
		$logged_info = Context::get('logged_info');
		if (($logged_info&&$logged_info->is_admin=='Y')||$addon_info->user_display=='Y') {
			Context::loadLang('./addons/controlbox/lang');
			Context::set('addon_path', getUrl() . 'addons/controlbox/');
			$oTemplate = &TemplateHandler::getInstance();
			$html = $oTemplate->compile('./addons/controlbox', 'controller');
			$output = $output . $html;
		}
    }
?>
