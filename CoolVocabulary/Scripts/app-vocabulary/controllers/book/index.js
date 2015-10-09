Vocabulary.BookIndexController = Ember.Controller.extend({
	inputWord: "",
	applicationCtrl: Ember.inject.controller('application'),
	books: function () {
        return this.store.peekAll("book");
    }.property(),
	initSiteDialog: function(){
		var self = this;
		var ctAdapter = new CTAdapter();	
		var langPair = this.get('applicationCtrl').langPair;
		var books = this.get('books').map(function(book){ 
			return {
				id: book.get('id'),
				name: book.get('name')
			};
		});
		var user = {
			name: $('#userName').text(),
			language: langPair.sourceLang,
			books: books
		};
		var bookId = this.get('model').id;
		ctAdapter.initSiteDialog(langPair, '#word_input_form', user, bookId, function(){
			if(!ctAdapter.extensionIsActive){
				$('#word_input_form').on('submit', self.showInstallCTAlert.bind(self));
			}
		});
	},
	showInstallCTAlert: function(){
		$('#install_ct_alert').modalPopover('show');
		return false;
	},
	recalculateWords: function(){
		var bookId = this.get('model').id;
		var all = this.store.peekAll('bookWord').filterBy('book.id', bookId);
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
		console.log('words recalculated...');
		console.log(result);
		this.set('words', result);
	},
	nouns: Ember.computed('words', function(){
		return this.get('words')[1];
	}),
	verbs: Ember.computed('words', function(){
		return this.get('words')[2];
	}),
	adjectives: Ember.computed('words', function(){
		return this.get('words')[3];
	}),
	adverbs: Ember.computed('words', function(){
		return this.get('words')[4];
	}),
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
		this.recalculateWords();
	}
});
