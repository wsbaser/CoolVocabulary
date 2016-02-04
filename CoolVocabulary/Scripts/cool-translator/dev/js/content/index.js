'use strict';

import '../services/abby/styles.styl';
import '../services/google/styles.styl';
import '../services/linguee/styles.styl';
import '../services/ll/styles.styl';
import '../services/multitran/styles.styl';
import '../services/tfd/styles.styl';

import CTContent from './ct-content';

import AbbyHandlers from '../services/abby/handlers';
import LingueeHandlers from '../services/abby/handlers';
import LLHandlers from '../services/abby/handlers';
import TFDHandlers from '../services/abby/handlers';

let abbyHandlers = new AbbyHandlers();
let lingueeHandlers = new LingueeHandlers();
let llHandlers = new LLHandlers();
let tfdHandlers = new TFDHandlers();

let ctContent = new CTContent();
ctContent.init();