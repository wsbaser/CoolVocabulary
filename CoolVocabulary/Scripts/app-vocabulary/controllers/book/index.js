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
	words: Ember.computed('model.bookWords.[]', function(){
		var bookId = this.get('model.id');
		return this.store.peekAll('bookWord').filterBy('book.id', bookId);
	}),
	nouns: Ember.computed.filterBy('words', 'speachPart', 1),
	verbs: Ember.computed.filterBy('words', 'speachPart', 2),
	adjectives: Ember.computed.filterBy('words', 'speachPart', 3),
	adverbs: Ember.computed.filter('words', function(item){ 
		var sp = item.get('speachPart');
		return sp===4 || sp ===0;
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
	},
	actions: {
		selectWord: function(bookWord){
			this.set('inputWord', bookWord.get('word.value'));
		}
	}
});
