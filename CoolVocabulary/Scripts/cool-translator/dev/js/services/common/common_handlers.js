'use strict';

function show_dialog_for_content(el) {
	var text = '';
	// .assemble text from text nodes only
	Array.prototype.forEach.call(this.childNodes, function(node){
		if(node.nodeType===3){
			text += node.textContent;
		}
	});
    Dialog.show(text.trim());
    return false;
};