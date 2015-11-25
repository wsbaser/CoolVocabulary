Vocabulary.BookIndexController = Ember.Controller.extend({
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
	bookWordsObserver: Ember.observer('model.bookWords.@each.learnLevel', function(){
		var totalCompletedCount = 0;
		this.store.peekAll('book').forEach(function(book){
	    	var isLoaded = book.get('isLoaded');
	    	if(isLoaded){
	    		// .count real amount of words and completed words
	    		var wordsCount = book.get('bookWords.length');
	    		var wordsCompletedCount = 0;
	    		book.get('bookWords').forEach(function(bookWord){
	    			if(bookWord.get('learnCompleted')){
	    				wordsCompletedCount++;
	    				totalCompletedCount++;
	    			}
	    		});
	    		book.set('wordsCount', wordsCount);
	    		book.set('wordsCompletedCount', wordsCompletedCount);
	    	}
		});
		this.set('totalCompletedCount', totalCompletedCount);
		var targetCount = this.get('targetCount');
		this.set('prizeOpacity', 0.3+(totalCompletedCount/targetCount)*0.7);
	}),
	targetCount: Ember.computed(function(){
		return 100;
	}),
	setupTargetProgress: Ember.observer('totalCompletedCount', function(){
		var targetCount = this.get('targetCount');
		var totalCompletedCount = this.get('totalCompletedCount');
		var fullWidth = $('#current_target_progress .full').attr('width'); 
		var completedWidth = Math.round((totalCompletedCount/targetCount)*fullWidth);
		$('#current_target_progress .completed').attr('width', completedWidth);
	}),	
	actions: {
		selectWord: function(bookWord){
			$('#word_input_form input').val(bookWord.get('word.value'));
			$('#word_input_form button[type="submit"]')[0].click();
		}
	}
});
