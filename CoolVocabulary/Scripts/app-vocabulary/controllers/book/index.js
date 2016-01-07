Vocabulary.BookIndexController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	languageCtrl: Ember.inject.controller('language'),
	language: Ember.computed.alias('languageCtrl.model'),
	user: Ember.computed.alias('applicationCtrl.model'),
	nativeLanguage: Ember.computed.alias('applicationCtrl.model.nativeLanguage'),
	books: Ember.computed('language', function(){
		var language = this.get('language');
		return this.store.peekAll('book').filterBy('language', language.id);
    }),
	initSiteDialog: function(){
		var self = this;
		var ctAdapter = new CTAdapter();
		var user = this.get('user');
		var book = this.get('model');
		var sourceLanguage = book.get('language');
		var langPairParam = {
			sourceLang: sourceLanguage,
			targetLang: user.get('nativeLanguage.id')
		};
		var booksParam = this.get('books').map(function(book){ 
			return {
				id: book.id,
				language: sourceLanguage, 
				name: book.get('name').trim()
			};
		});
		var userParam = {
			name: user.get('displayName'),
			language: user.get('nativeLanguage.id'),
			books: booksParam
		};
		ctAdapter.initSiteDialog(langPairParam, '#word_input_form', userParam, book.id, function(){
			if(!ctAdapter.extensionIsActive){
				$('#word_input_form').on('submit', self.showInstallCTAlert.bind(self));
			}
		});
	},
	installCT: function(){
		var self = this;
		chrome.webstore.install('https://chrome.google.com/webstore/detail/cifbpdjhjkopeekabdgfjgmcbcgloioi', function(){
			window.location.reload();
		}, function(error){
			if(error==='User cancelled install'){
				self.showAntiRejectCTAlert();
			}
		});
	},
	showAntiRejectCTAlert: function(){
		var self = this;
		if(self.antiRejectIsShown){
			// . show only once
			return;
		}
		BootstrapDialog.show({
            title: 'Warning',
            message: 'Cool Vocabulary works only in couple with Cool Translator. '+
            	'You can\'t add new translations without it. '+
            	'You can only learn words from public books.',
            size: BootstrapDialog.SIZE_SMALL,
            buttons: [{
	                label: 'Cancel',
	                cssClass: 'modal-cancel',
	                action: function(dialog) {
						dialog.close();
					}
            	},{
	                label: 'Install',
	                action: function(dialog){
	                	self.installCT();
						dialog.close();
	                }
            	}]
            });
		self.antiRejectIsShown = true;
	},
	showInstallCTAlert: function(){
		var self = this;
		var CTWebStoreUrl = 'https://chrome.google.com/webstore/detail/cool-translator/cifbpdjhjkopeekabdgfjgmcbcgloioi?hl=en';
		BootstrapDialog.show({
            title: 'Confirmation is neccessary',
            message: 'It is neccessary to install <a href='+CTWebStoreUrl+'>Cool Translator</a> extension. '+
            	'Cool Vocabulary uses it as a source of word translations.',
            draggable: true,
            size: BootstrapDialog.SIZE_SMALL,
            buttons: [{
					label: 'Cancel',
					cssClass: 'modal-cancel',
	                action: function(dialog) {
	                	self.showAntiRejectCTAlert();
	                	dialog.close();
	                }
            	},{
	                label: 'Install',
	                action: function(dialog){
	                	self.installCT();
					}
            	}]
        	});
		window.event.preventDefault();
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
		findOrAdd(this.store, 'translation', translationDto);
		findOrAdd(this.store, 'bookWord', bookWordDto);
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
