Vocabulary.BookIndexController = Ember.Controller.extend({
	inputWord: "",
	applicationCtrl: Ember.inject.controller('application'),
	init: function(){
		this.initSiteDialog();
	}.on('init'),
	books: function () {
        return this.store.peekAll("book");
    }.property(),
	initSiteDialog: function(){
		var self = this;
		var ctAdapter =  new CTAdapter();
		this.set('ctAdapter', ctAdapter);
		var langPair = this.get('applicationCtrl').langPair;
		$('#word_input_form').off('submit', this.showInstallCTAlert);
		var authCookie = {
			name: '.AspNet.ApplicationCookie',
			value: null
		};
		authCookie.value = $.cookie(authCookie.name);
		ctAdapter.initSiteDialog(langPair, '#word_input_form', authCookie, function(){
			if(ctAdapter.extensionIsActive){
				return;
			}
			$('#word_input_form').on('submit', self.showInstallCTAlert);
		});
	},
	showInstallCTAlert: function(){
		console.log('show popover');
		$('#install_ct_alert').modalPopover('show');
		return false;
	},
	bookwords: function(){
		return this.store.peekAll('bookWord');
	}.property(),
	words: function(){
		var bookId = this.get('model').id;
		var all = this.get('bookwords').toArray();
		var result = {};
		for (var i = all.length - 1; i >= 0; i--) {
			var bookword = all[i];
			var translations = bookword.get('translations').toArray();
			for (var j = translations.length - 1; j >= 0; j--) {
				var translation = translations[j];
				var speachPart = translation.get('speachPart');
				var spPairs = result[speachPart];
				if(!spPairs){
					spPairs = result[speachPart] = {};
				}
				var pair = spPairs[bookword.id];
				if(!pair){
					pair = spPairs[bookword.id] = {
						bookword : bookword,
						translations : []
					};
				}
				pair.translations.push(translation);
			}
		}
		for (var sp in result){
			var wordsObj = result[sp];
			var wordsArr = [];
			for (var bookwordId in wordsObj) {
				wordsArr.push(wordsObj[bookwordId]);
			}
			result[sp] = wordsArr;
		}
		console.log(result);
		return result;
	}.property('bookwords'),
	nouns: function(){
		return this.get('words')[1];
	}.property('words'),
	verbs: function(){
		return this.get('words')[2];
	}.property('words'),
	adjectives: function(){
		return this.get('words')[3];
	}.property('words'),
	adverbs: function(){
		return this.get('words')[4];
	}.property('words'),
	addTranslation: function(bookDto, wordDto, bookWordDto, translationDto){
		function findOrAdd(store, type, data){
			var record = store.peekRecord(type, data.id);
			if(!record){
				record = store.push(store.normalize(type, data));
			}
			return record;
		}
		findOrAdd(this.store, 'book', bookDto);
		findOrAdd(this.store, 'word', wordDto);
		findOrAdd(this.store, 'bookWord', bookWordDto);
		findOrAdd(this.store, 'translation', translationDto);
	}
});
