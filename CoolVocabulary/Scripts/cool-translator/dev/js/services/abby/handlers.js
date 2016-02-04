export default class AbbyHandlers{
    show_example_source(btnEl){
        btnEl = $(btnEl);
        btnEl.toggleClass('expanded');
        var rowEl = btnEl.closest('.js-examples-table-trans');
        var sourceEl = rowEl.find('+* .js-examples-table-slidebox');
        if (btnEl.hasClass('expanded')) {
            btnEl.attr("title", "Hide source");
            sourceEl.showImportant();
        }
        else {
            btnEl.attr("title", "Show source");
            sourceEl.hide();
        }
        return false;
    }
}