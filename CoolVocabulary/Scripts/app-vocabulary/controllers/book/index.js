Vocabulary.CT_WEBSTORE_LINK = '<a target="_blank" href='+CTAdapter.CT_WEBSTORE_URL+'>Cool Translator</a>';

Vocabulary.BookIndexController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	languageCtrl: Ember.inject.controller('language'),
	language: Ember.computed.alias('languageCtrl.model'),
	user: Ember.computed.alias('applicationCtrl.model'),
	nativeLanguage: Ember.computed.alias('applicationCtrl.model.nativeLanguage'),
	userBooks: Ember.computed.alias('languageCtrl.userBooks'),
	userBooksSorting: ['inProgressCount:desc'],
	sortedUserBooks: Ember.computed.sort('userBooks','userBooksSorting'),
	initCT: function(){
		var self = this;
		var ctAdapter = this.get('applicationCtrl.CTAdapter');
		if(ctAdapter.extensionIsActive===undefined){
			this.addCTAuthenticationEndEvent();
		} else if(ctAdapter.extensionIsActive){
			var languageCtrl = this.get('languageCtrl');
			var langPairParam = languageCtrl.getLangPairForCT();
			var bookId = this.get('model.book.id');
			ctAdapter.initSiteDialog(langPairParam, '#word_input_form', bookId);
			languageCtrl.updateLanguageBooksInCT();
		} else{
			$('#word_input_form').on('submit', self.showInstallCTAlert.bind(self));
		}
	},
	addCTAuthenticationEndEvent: function(){
		var applicationReactor = this.get('applicationCtrl.reactor');
  		applicationReactor.addEventListener('ctAuthenticationEnd', this.initCT.bind(this));		
	},
	installCT: function(){
		var self = this;
		var progressDialog = BootstrapDialog.show({
            title: 'Cool Translator installation',
            message: 'Please, wait while '+Vocabulary.CT_WEBSTORE_LINK+' is being installed...',
            closable: false,
            size: BootstrapDialog.SIZE_SMALL});
		chrome.webstore.install(CTAdapter.CT_WEBSTORE_URL, function(){
			progressDialog.close();
			BootstrapDialog.show({
	            title: 'Cool Translator activation',
	            message: 'Page will be updated to activate '+Vocabulary.CT_WEBSTORE_LINK+'...',
	            closable: false,
	            size: BootstrapDialog.SIZE_SMALL});
			setTimeout(function(){
				window.location.reload();
			}, 3000);
		}, function(error){
			progressDialog.close();
			if(error==='User cancelled install'){
				self.showAntiRejectCTAlert();
			}
			else{
				BootstrapDialog.show({
		            title: 'Cool Translator installation error',
		            message: error,
		            size: BootstrapDialog.SIZE_SMALL,
		            buttons: [{
	                	label: 'OK',
	                	action: function(dialog) {
							dialog.close();
						}}]
            		});
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
            message: 'You will not be able to add new words without '+Vocabulary.CT_WEBSTORE_LINK+'. '+
            	'Though, you can learn words from public books.',
            size: BootstrapDialog.SIZE_SMALL,
            buttons: [{
	                label: 'Install',
	                cssClass: 'modal-cancel',
	                action: function(dialog){
	                	self.installCT();
						dialog.close();
	                }
            	},{
	                label: 'Close',
	                action: function(dialog) {
						dialog.close();
					}
            	}]
            });
		self.antiRejectIsShown = true;
	},
	showInstallCTAlert: function(){
		var self = this;
		if(!window.chrome){
			BootstrapDialog.alert('Impossible to add translation in current browser. '+
				'You need to install Cool Translator extension wich is available in Chrome browser only.');
			return;			
		}
		BootstrapDialog.show({
            title: 'Confirmation is neccessary',
            message: 'It is neccessary to install Chrome extension '+Vocabulary.CT_WEBSTORE_LINK+'. '+
            	'Cool Vocabulary uses it as a source of translations.',
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
						dialog.close();
					}
            	}]
        	});
		window.event.preventDefault();
	},
	words: Ember.computed.alias('model.book.bookWords'), 
	// 	function(){
	// 	var bookId = this.get('model.book.id');
	// 	return this.store.peekAll('bookWord').filterBy('book.id', bookId);
	// }),
	nouns: Ember.computed.filterBy('words', 'speachPart', 1),
	verbs: Ember.computed.filterBy('words', 'speachPart', 2),
	adjectives: Ember.computed.filterBy('words', 'speachPart', 3),
	adverbs: Ember.computed.filter('words', function(item){ 
		var sp = item.get('speachPart');
		// . unknown, adverbs, pronouns, prepositions, conjucntions, interjections
		return sp>=4 || sp===0;
	}),
	addTranslation: function(userBookDto, bookDto, wordDto, bookWordDto, translationDto){
		// function updateUserBookTranslations(store, userBookId, bookWordId, translationId){
		// 	var userBook = store.peekRecord('userBook', userBookId);
		//     var translations = userBook.get('translations');
		//     if(!translations[bookWordId]){
		//         translations[bookWordId] = [];
		//     }
		//     translations[bookWordId].push(translationId);
		// }
		function findOrAdd(store, type, data){
			var record = store.peekRecord(type, data.id);
			if(!record){
				record = store.push(store.normalize(type, data));
			}
			return record;
		}
		findOrAdd(this.store, 'userBook', userBookDto);
		findOrAdd(this.store, 'book', bookDto);
		findOrAdd(this.store, 'word', wordDto);
		findOrAdd(this.store, 'translation', translationDto);
		findOrAdd(this.store, 'bookWord', bookWordDto);
		// updateUserBookTranslations(this.store, userBookDto.id, bookWordDto.id, translationDto.id);

		// . recalculate days
		this.get('languageCtrl').notifyPropertyChange('days');
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
