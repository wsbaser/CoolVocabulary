/**
 * Created by wsbaser on 15.07.2015.
 */

function AbbySource(provider){
	CachedSource.call(this,provider,
		[ContentTypes.Translations,
		ContentTypes.Examples,
		ContentTypes.Phrases]);
}

AbbySource.prototype = Object.create(CachedSource.prototype);

AbbySource.prototype.generateTranslationsCard = function(){};
AbbySource.prototype.generateExamplesCard = function(){};
AbbySource.prototype.generatePhrasesCard = function(){};