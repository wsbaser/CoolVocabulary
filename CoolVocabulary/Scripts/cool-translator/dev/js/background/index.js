'use strict';

import CTBackground from './ct-background';
import guid from 'guid';
import injectJQueryPlugins from 'jquery-plugins';

injectJQueryPlugins();

$.ajaxSetup({
    headers: {"X-Requested-With":"XMLHttpRequest"}
});

window.ctBackground = new CTBackground();
window.ctBackground.run();