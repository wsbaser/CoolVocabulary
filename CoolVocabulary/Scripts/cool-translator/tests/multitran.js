QUnit.module('multitran');
QUnit.test("Provider. Supported languages", function( assert ) {
	// . arrange
	var config = MultitranConfig();
	function hasLang(lang){
		return config.languages[lang] && config.languages[lang].id;
	}
	// . assert
	assert.ok(hasLang('en'), "English is not configured");
	assert.ok(hasLang('es'), "Spanish is not configured");
	assert.ok(hasLang('pt'), "English is not configured");
	assert.ok(hasLang('fr'), "French is not configured");
	assert.ok(hasLang('it'), "Italian is not configured");
	assert.ok(hasLang('de'), "German is not configured");
	assert.ok(hasLang('ru'), "Russian is not configured");
});

QUnit.test("Provider. Format request url", function( assert ) {
 	// . arrange
 	var config = MultitranConfig();
 	var provider = new MultitranProvider(config);
 	var requestData = {
 		sourceLang: 'en',
 		targetLang: 'ru',
 		word: 'vigil'
 	};
 	// . act
  	var url = provider.formatRequestUrl(config.ajax.translate, requestData);
  	// . assert
  	assert.equal(url, "http://multitran.com/m.exe?l1=1&l2=2&s=vigil", "Invalid request url");
});

QUnit.test("Service. Generate translations card. No result.", function(assert) {
 	// . arrange
 	var config = MultitranConfig();
 	var provider = new MultitranProvider(config);
 	var service = new MultitranService(provider);
 	// . act
 	var contentEl = $();
 	var card = service.generateTranslationsCard(contentEl);
	// . assert
	assert.notOk(card,'Card is generated? Really?!'); 	 	
});

QUnit.test("Service. Generate translations card. Valid result.", function(assert) {
 	// . arrange
 	var config = MultitranConfig();
 	var provider = new MultitranProvider(config);
 	var service = new MultitranService(provider);
 	// . act
 	var contentEl = $(Mother.RESPONSE_EN_VIGIL);
 	var card = service.generateTranslationsCard(contentEl);
 	// . assert
 	assert.ok(card,"Invalid card for valid service result");
 	assert.ok("TABLE", $(card)[0].tagName, "Invalid root tag for card"); 	
});

QUnit.test("Service. Get translations. Valid result.", function(assert) {
 	// . arrange
 	var config = MultitranConfig();
 	var provider = new MultitranProvider(config);
 	var service = new MultitranService(provider);
 	var requestData = {
 		sourceLang: 'en',
 		targetLang: 'ru',
 		word: 'vigil'
 	};
 	var contentEl = $(Mother.RESPONSE_EN_VIGIL);
 	var card = service.generateTranslationsCard(contentEl);
	service.saveToCache(requestData, ContentTypes.TRANSLATIONS, card);
	// . act
	var result = service.getTranslations(requestData);
 	// . assert
 	assert.ok(result['vigil'], "No translations at all");
 	assert.ok(result['vigil'][SpeachParts.NOUN], "No NOUN translations");
 	assert.notOk(result['vigil'][SpeachParts.VERB], "Should not have VERB translations");
 	assert.notOk(result['vigil'][SpeachParts.ADVERB], "Should not have ADVERB translations");
 	assert.notOk(result['vigil'][SpeachParts.ADJECTIVE], "Should not have ADJECTIVE translations");
 	assert.notOk(result['vigil'][SpeachParts.UNKNOWN], "Should not have UNKNOWN translations");
 	assert.equal(1,Object.keys(result).length,"Should have translations only for one lemma");
});

var Mother = {};
Mother.RESPONSE_EN_VIGIL = '<table width="100%">\
<tbody><tr><td colspan="2" class="gray">&nbsp;<a href="/m.exe?a=118&amp;l1=1&amp;s=vigil">vigil</a> <span style="color:gray">\'vɪʤɪl</span> <em>n</em> <span style="color:gray">|</span> <a target="_blank" href="http://www.merriam-webster.com/dictionary/vigil" rel="nofollow"><span class="small">Webster</span></a> <span style="color:gray">|</span> <a href="#phrases">phrases</a> <span style="color:gray">|</span> <a href="#thesaurus">thesaurus</a> <span style="color:gray">|</span> <a href="#langs">languages</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=0&amp;l1=1&amp;l2=2">gener.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=бодрствование&amp;l1=2&amp;l2=1">бодрствование</a>; <a href="/m.exe?s=дежурство&amp;l1=2&amp;l2=1">дежурство</a>; <a href="/m.exe?s=пикетирование&amp;l1=2&amp;l2=1">пикетирование</a> <span style="color:gray">(здания суда, посольства и т. п.)</span>; <a href="/m.exe?s=пост накануне праздника&amp;l1=2&amp;l2=1">пост накануне праздника</a>; <a href="/m.exe?s=всенощное бдение&amp;l1=2&amp;l2=1">всенощное бдение</a>; <a href="/m.exe?s=всенощная&amp;l1=2&amp;l2=1">всенощная</a>; <a href="/m.exe?s=канун праздника&amp;l1=2&amp;l2=1">канун праздника</a>; <a href="/m.exe?s=ночное дежурство&amp;l1=2&amp;l2=1">ночное дежурство</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=738&amp;l1=1&amp;l2=2">christ.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=бдеть&amp;l1=2&amp;l2=1">бдеть</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=16&amp;l1=1&amp;l2=2">church.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=канун праздника&amp;l1=2&amp;l2=1">канун праздника</a> <span style="color:gray">(особ. постный день)</span>; <a href="/m.exe?s=ночная служба&amp;l1=2&amp;l2=1">ночная служба</a>; <a href="/m.exe?s=канун&amp;l1=2&amp;l2=1">канун</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=16&amp;l1=1&amp;l2=2">church.,&nbsp;obs.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=заупокойная молитва&amp;l1=2&amp;l2=1">заупокойная молитва</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=24&amp;l1=1&amp;l2=2">milit.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=непрерывное дежурство&amp;l1=2&amp;l2=1">непрерывное дежурство</a>; <a href="/m.exe?s=непрерывное наблюдение&amp;l1=2&amp;l2=1">непрерывное наблюдение</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=99&amp;l1=1&amp;l2=2">mus.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=вигилия&amp;l1=2&amp;l2=1">вигилия</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=17&amp;l1=1&amp;l2=2">obs.,&nbsp;poet.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=стража&amp;l1=2&amp;l2=1">стража</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=22&amp;l1=1&amp;l2=2">poet.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=бессонница&amp;l1=2&amp;l2=1">бессонница</a></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil&amp;sc=44&amp;l1=1&amp;l2=2">relig.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=ночное бдение&amp;l1=2&amp;l2=1">ночное бдение</a>; <a href="/m.exe?s=бдение&amp;l1=2&amp;l2=1">бдение</a></td></tr>\
<tr><td colspan="2" class="gray">&nbsp;<a href="/m.exe?a=118&amp;l1=1&amp;s=vigil (The day before a religious feast observed as a day of spiritual preparation)">vigil</a> <span style="color:gray">The day before a religious feast observed as a day of spiritual preparation</span> <em>n</em></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil (The day before a religious feast observed as a day of spiritual preparation)&amp;sc=44&amp;l1=1&amp;l2=2">relig.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=навечерие&amp;l1=2&amp;l2=1">навечерие</a></td></tr>\
<tr><td colspan="2" class="gray">&nbsp;<a href="/m.exe?a=118&amp;l1=1&amp;s=vigil (A watch formerly kept on the night before a religious feast with prayer or other devotions)">vigil</a> <span style="color:gray">A watch formerly kept on the night before a religious feast with prayer or other devotions</span> <em>n</em></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil (A watch formerly kept on the night before a religious feast with prayer or other devotions)&amp;sc=44&amp;l1=1&amp;l2=2">relig.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=вигилия&amp;l1=2&amp;l2=1">вигилия</a></td></tr>\
<tr><td colspan="2" class="gray">&nbsp;<a href="/m.exe?a=118&amp;l1=1&amp;s=vigil (Evening or nocturnal devotions or prayers)">vigil</a> <span style="color:gray">Evening or nocturnal devotions or prayers</span> <em>n</em></td></tr>\
<tr><td class="subj" width="1"><a href="/m.exe?a=110&amp;s=vigil (Evening or nocturnal devotions or prayers)&amp;sc=44&amp;l1=1&amp;l2=2">relig.</a></td>\
<td class="trans" width="100%"><a href="/m.exe?s=всенощная&amp;l1=2&amp;l2=1">всенощная</a></td></tr></tbody></table>';