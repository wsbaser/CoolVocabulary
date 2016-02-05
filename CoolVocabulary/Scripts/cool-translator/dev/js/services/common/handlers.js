'use strict';

export default class CommonHandlers{
	show_dialog_for_content(el) {
		var text = '';
		// .assemble text from text nodes only
		Array.prototype.forEach.call(el.childNodes, function(node){
			if(node.nodeType===3){
				text += node.textContent;
			}
		});
	    window.ctContent.dialog.show(text.trim());
	    return false;
	}
}