Vocabulary.GoogleTranslationsCardComponent = Ember.Component.extend({
    classNames: ['google-translations-card'],
    data: Ember.computed('card', function(){
		var data = this.get('card.data');
        var result = [];
        if(data){
            for (var sp in data) {
                var translations = data[sp]; 
                result.push({
                    sp: sp,
                    translations: translations
                });
                this.prepareReverseTranslations(translations);
            }
        }
        return result;
	}),
    prepareReverseTranslations:function(translations){
        translations.forEach(function(translation){
            if(translation.reverse_translation){
                translation.reverseTranslations = translation.reverse_translation.map(function(item, index){
                    return {
                        value: item,
                        isLast: index===(translation.reverse_translation.length-1) 
                    };
                });
                delete translation.reverse_translation;
            }
        });
    }
});