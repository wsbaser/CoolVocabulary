'use strict';

import jQuery from 'jquery';

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

jQuery.fn.showImportant = function() {
    this.show();
   	let displayValue = this[0].style['display'];
    this[0].style.setProperty('display',displayValue,'important');
};

jQuery.fn.hideImportant = function() {
    this[0].style.setProperty('display','none','important');
};

jQuery.fn.flatText = function(){
 	let text = '';
  // .assemble text from text nodes only
  Array.prototype.forEach.call(this[0].childNodes, function(node){
    if(node.nodeType===3){
      text += node.textContent;
    }
  });
  return text.trim();
};

export default jQuery;