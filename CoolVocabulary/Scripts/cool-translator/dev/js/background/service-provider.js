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
import LingueeProvider from '../services/linguee/provider';
import LLProvider from '../services/ll/provider';
import MultitranProvider from '../services/multitran/provider';
import TFDProvider from '../services/tfd/provider';
import CVProvider from '../services/cv/provider';

import AbbyService from '../services/abby/service';
import GoogleService from '../services/google/service';
import LingueeService from '../services/linguee/service';
import LLService from '../services/ll/service';
import MultitranService from '../services/multitran/service';
import TFDService from '../services/tfd/service';
import CVService from '../services/cv/service';

export default class ServiceProvider{
	get ll(){
		return this._ll||(this._ll = new LLService(new LLProvider(LLConfig)));
	}

	get abby(){
		return this._abby||(this._abby = new AbbyService(new AbbyProvider(AbbyConfig)));
	}

	get google(){
		return this._google||(this._google = new GoogleService(new GoogleProvider(GoogleConfig)));
	}

	get linguee(){
		return this._linguee || (this._linguee = new LingueeService(new LingueeProvider(LingueeConfig)));
	}

	get tfd(){
		return this._tfd || (this._tfd = new TFDService(new TFDProvider(TFDConfig)));
	}

	get multitran(){
		return this._multitran ||(this._multitran = new MultitranService(new MultitranProvider(MultitranConfig)));
	}

	get dictionaryServices(){
		return [this.ll, this.abby, this.google, this.tfd, this.linguee, this.multitran];
	}

	get cv(){
		return this._cv ||(this._cv = new CVService(new CVProvider(CVConfig), this.dictionaryServices));
	}

	get all(){
		return this.dictionaryServices.concat([this.cv]);
	}
}