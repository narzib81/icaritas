/*
 * Control Box Script
 * http://www.nurigo.net/
 * http://www.xecameron.com/
 *
 * Copyright 2011, Wiley Choi
 * Copyright 2012, Jinhwa Ko
 *
 * vi:set sw=4 ts=4 noexpandtab fileencoding=utf-8:
 */

function control_get_lang($f, name) {
	var text = '';
	$f.find('>'+name).each(function() {
		var $obj = jQuery(this);
		if ($obj.attr('xml:lang')==lang_type) text = $obj.text();
	});
	return text;
}

function control_reset_settings(f) {
	jQuery('input',f).filter(function(index) {
		return jQuery(this).attr('rel')=='field';
	}).each(function() {
		jQuery(this).val('');
	});
	jQuery('select',f).each(function() {
		jQuery(this).empty();
	});

	jQuery(f).submit();
}

function control_get_vars(htmlObj) {
	$group_obj = jQuery(htmlObj);
	var group_hidden = false;
	var hidden_vars = '';
	if ($group_obj.attr('hidden')=='true') group_hidden = true;

	$table = jQuery('<table></table>');
	$group_obj.find(">var").each(function() {
		var $f = jQuery(this);
		var name = $f.attr('name');
		var id = $f.attr('id');
		var type = $f.attr('type');
		var title = control_get_lang($f, 'title');
		var description = control_get_lang($f, 'description');
		var x_type = $f.attr('x-type');
		var selector = $f.attr('selector');
		var attribute = $f.attr('attribute');
		var _event = $f.attr('event');
		var script = $f.attr('script');
		var style = $f.attr('style');
		var defval = '';
		var hidden = $f.attr('hidden');
		if (group_hidden) hidden = 'true';

		if (layout_info[name]) defval = layout_info[name];

		if (hidden == 'true') {
			hidden_vars += '<input type="hidden" rel="field" name="'+name+'" value="'+defval+'" />';
		} else {
			var $val = jQuery('<span></span>');
			switch (type) {
				case 'select':
					$val = jQuery('<select name="'+name+'"></select>');
					$f.find("options").each(function() {
						var $obj = jQuery(this);
						var opt_title = control_get_lang($obj, 'title');
						var attr = '';
						if ($obj.attr('value')==defval) attr = ' selected="selected"';
						var $opt = jQuery(jQuery.sprintf('<option value="%s"'+attr+'>%s</option>', $obj.attr('value'), opt_title));
						$opt.appendTo($val);
					});
					break;
				case 'text':
					var attr='';
					$val = jQuery(jQuery.sprintf('<input name="%s" type="text" value="%s"'+attr+' />', name, defval));
					if (x_type=='colorpicker'&&selector) {
						$val.ColorPicker({
							onChange:function(hsb, hex, rgb) { 
								jQuery(selector).css(attribute,'#'+hex);
								$val.val(hex);
							},
							onSubmit:function(hsb, hex, rgb, el) { jQuery(el).val(hex); jQuery(el).ColorPickerHide(); }
						});
					}
					break;
				case 'textarea':
					$val = jQuery(jQuery.sprintf('<textarea name="%s">%s</textarea>', name, defval));
					break;
				case 'image':
					var file_html = '<input name="'+name+'" type="file" value="" style="display:none" /><div onclick="jQuery(this).prev().show().click();" style="cursor:pointer;"><span class="filechoose">Choose File</span> <span class="fileplus"></span></div>';
					if (layout_info[name]) {
						var image_html = '<div width="80"><img src="'+layout_info[name]+'" style="width:80px;" /></div>';
					} else {
						var image_html = '<div></div>';
					}
					$val = jQuery(image_html + file_html);
					break;
				default:
					$val = jQuery('<span></span>');
					break;
			}
			if (id) {
				$val.attr('id', id);
			}
			if (_event && script) {
				$val.bind(_event, function() { eval(script); });
			}
			$val.attr('title', description);
			$tr = jQuery('<tr></tr>');
			$tr.append('<th>'+title+'</th>');
			$tr.append(jQuery('<td></td>').append($val));
			$tr.appendTo($table);
		}
	});
	return [$table, hidden_vars];
}

function control_process(data) {
	$form = jQuery('.layout-controller .slideout-content form');
	$content = jQuery('.layout-controller .slideout-content form .control-content');

	// extra_vars
	jQuery(data).find("extra_vars").each(function() {
		var groups = new Array();
		// check groups
		jQuery(this).find(">group").each(function() {
			groups[groups.length] = this;
		});
		if (groups.length) {
			var visible_count = 0;
			for(i = 0; i < groups.length; i++) {
				var g = groups[i];
				var r = control_get_vars(g);
				var $table = r[0];
				var hidden_vars = r[1];
				if (jQuery(g).attr('hidden')!='true') {
					var title = control_get_lang(jQuery(groups[i]),'title');
					var closed = '<span class="toggle open"></span><span class="toggle close" style="display:none;"></span>';
					var opened = '<span class="toggle open" style="display:none;"></span><span class="toggle close"></span>';
					$content.append('<div class="group-title"><a onclick="jQuery(this).next().click();"><span class="title_text">'+title+'</span></a><a href="#" class="toggle-group" onclick="return false;">'+(visible_count==0?opened:closed)+'</a></div>');
					if(visible_count>0) $table.css('display','none');
					$content.append($table);
					visible_count++;
				}
				$form.append(hidden_vars);
			}
		} else {
			var r = control_get_vars(this);
			var $table = r[0];
			var hidden_vars = r[1];
			$content.append($table);
			$form.append(hidden_vars);
		}
	});


	// menus
	jQuery(data).find("menus").each(function() {
		jQuery(this).find("menu").each(function() {
			var $menu = jQuery(this);
			var name = $menu.attr('name');
			var menu_title = control_get_lang($menu, 'title');
			if (menus[name]) {
				var menu_srl = menus[name]['menu_srl'];
				$form.append('<input type="hidden" name="'+name+'" value="'+menu_srl+'" />');
			}
		});
	});
	jQuery('.layout-controller .toggle-group').click(function() {
		jQuery(this).children().toggle();
		jQuery(this).parent().next().toggle();
	});
}

(function($) {
	jQuery(function($) {

		jQuery.ajax({
			url: info_path,
			dataType: "xml",
			success: function(data) {
				control_process(data);
			}
		});
	});
}) (jQuery);
