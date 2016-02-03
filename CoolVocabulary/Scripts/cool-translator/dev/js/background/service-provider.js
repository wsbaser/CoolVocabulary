'use strict';

import AbbyConfig from '../services/abby/config';
import GoogleConfig from '../services/google/config';
import LingueeConfig from '../services/linguee/config';
import LLConfig from '../services/ll/config';
import MultitranConfig from '../services/multitran/config';
import TFDConfig from '../services/tfd/config';
import CVConfig from '../services/cv/config';

import AbbyProvider from '../services/abby/provider';
import GoogleProvider from '../services/google/provider';
import LingueeProvider from '../services/abby/provider';
import LLProvider from '../services/ll/provider';
import MultitranProvider from '../services/abby/provider';
import TFDProvider from '../services/tfd/provider';
import CVProvider from '../services/abby/provider';

import AbbyService from '../services/abby/service';
import GoogleService from '../services/google/service';
import LingueeService from '../services/abby/service';
import LLService from '../services/ll/service';
import MultitranService from '../services/abby/service';
import TFDService from '../services/tfd/service';
import CVService from '../services/abby/service';

export default class ServiceProvider{
	get ll(){
		return this.ll||(this.ll = new LLService(new LLProvider(LLConfig)));
	}

	get abby(){
		return this.abby||(this.abby = new AbbyService(new AbbyProvider(AbbyConfig)));
	}

	get google(){
		return this.google||(this.google = new GoogleService(new GoogleProvider(GoogleConfig)));
	}

	get linguee(){
		return this.linguee || (this.linguee = new LingueeService(new LingueeProvider(LingueeConfig)));
	}

	get tfd(){
		return this.tfd || (this.tfd = new TfdService(new TfdProvider(TfdConfig)));
	}

	get multitran(){
		return this.multitran ||(this.multitran = new MultitranService(new MultitranProvider(MultitranConfig)));
	}

	get dictionaryServices(){
		return [this.ll, this.abby, this.google, this.tfd, this.linguee, this.multitran];
	}

	get cv(){
		return this.cv ||(new CVService(new CVProvider(CVConfig, dictionaryServices)));
	}

	get all(){
		return this.dictionaryServices.concat([this.cv]);
	}
}