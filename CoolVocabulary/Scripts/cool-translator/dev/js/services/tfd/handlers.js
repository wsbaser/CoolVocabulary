export default class TFDHandlers{
    SelectVT(sel){
        var v=sel.options[sel.selectedIndex].value;
        if(v=="0")
            return;
        var tableIndex = parseInt(v.split("_")[1]);
        var i=1;
        var tableEl=sel;
        while(tableEl = tableEl.nextElementSibling){
            if((i++)==tableIndex)
                tableEl.classList.remove("hiddenStructure");
            else
                tableEl.classList.add("hiddenStructure");
        }
    }

    pron_key(t){
        var pkw=open('http://www.thefreedictionary.com/_/pk'+(t==1?'_ipa':'')+'.htm','pk','width='+(t==1?'800':'630')+',height='+(t==1?'865':'710')+',statusbar=0,menubar=0');
        if(window.focus)pkw.focus();
        return false;
    }
}