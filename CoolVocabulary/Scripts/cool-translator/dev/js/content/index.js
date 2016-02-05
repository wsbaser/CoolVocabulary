'use strict';

import '../services/abby/styles.styl';
import '../services/google/styles.styl';
import '../services/linguee/styles.styl';
import '../services/ll/styles.styl';
import '../services/multitran/styles.styl';
import '../services/tfd/styles.styl';


import CTContent from './ct-content';

import AbbyHandlers from '../services/abby/handlers';
import LingueeHandlers from '../services/linguee/handlers';
import LLHandlers from '../services/ll/handlers';
import TFDHandlers from '../services/tfd/handlers';
import CommonHandlers from '../services/common/handlers';

import injectJQueryPlugins from 'jquery-plugins';

injectJQueryPlugins();

window.abbyHandlers = new AbbyHandlers();
window.lingueeHandlers = new LingueeHandlers();
window.llHandlers = new LLHandlers();
window.tfdHandlers = new TFDHandlers();
window.commonHandlers = new CommonHandlers();

window.ctContent = new CTContent();
window.ctContent.init();