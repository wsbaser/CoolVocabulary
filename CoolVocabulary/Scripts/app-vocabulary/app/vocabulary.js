window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
  this.route('book', { path: 'book/:book_id' },function(){
    this.route('learn');
    this.route('exam');
  });
});

Vocabulary.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  pathForType: function(type) {
    return type.camelize().capitalize();
  }
});

Vocabulary.ApplicationSerializer = DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryType, payload, id, requestType) {
    if(payload.emberDataFormat){
      return this._super(store, primaryType, payload, id, requestType);
    }
    else {
      var i, record, payloadWithRoot;
      // if the payload has a length property, then we know it's an array
      if (payload.length) {
        for (i = 0; i < payload.length; i++) {
          record = payload[i];
          this.mapRecord(record);
        }
      } else {
        // payload is a single object instead of an array
        this.mapRecord(payload);
      }
      payloadWithRoot = {};
      payloadWithRoot[primaryType.modelName.pluralize()] = payload;
      return this._super(store, primaryType, payloadWithRoot, id, requestType);
    }
  },
  mapRecord: function(item) {
    var propertyName, value, newPropertyName;
    for (propertyName in item){
      value = item[propertyName];
      newPropertyName = propertyName.camelize();
      item[newPropertyName] = value;
      delete item[propertyName];
    }
  },
  serializeIntoHash: function(hash, type, record, options) {
    var jsonRecord, propertyName, value;
    jsonRecord = record.toJSON();
    for (propertyName in jsonRecord) {
      value = jsonRecord[propertyName];
      hash[propertyName.capitalize()] = value;
    }
  }
});

function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, user, bookId, callback){
	var self = this;
	chrome.runtime.sendMessage("eplepheahdinbfhnjjnkhkebfdhenbad", {
		initDialog: {
			langPair: langPair,
			attachBlockSelector: attachBlockSelector,
			user: user,
			bookId: bookId
		}
	},
	function(response) {
		self.extensionIsActive = !!response;
		callback();
	});
};
Vocabulary.LearnComponent = Ember.Component.extend({
	didInsertElement: function(){
		var self = this;
		$('#content')[0].addEventListener('heightChanged', function(){
			var offset = CARD_HEIGHT-$('.stencil>.top-block').height();
			console.log('scroll cards shadow to ' + offset);
			$('.learning-cards-shadow').scrollTop(offset);
		});
		$('.learning-col').bind('mousewheel', function(event) {
			self.get('controller').showNeighbourCard(event.originalEvent.wheelDeltaY>0?-1:1);
			return true;
		});
	},
	willRemoveElement:function(){
		$('.learning-col').unbind('mousewheel');
	}
});
Vocabulary.SpechPartBlock = Ember.Component.extend({
	words:[]
});
Vocabulary.ApplicationController = Ember.Controller.extend({
	langPair: { sourceLang:'en', targetLang:'ru' }
});
Vocabulary.BookController = Ember.Controller.extend({
});
Vocabulary.BookIndexController = Ember.Controller.extend({
	inputWord: "",
	applicationCtrl: Ember.inject.controller('application'),
	books: function () {
        return this.store.peekAll("book");
    }.property(),
	initSiteDialog: function(){
		var self = this;
		var ctAdapter =  new CTAdapter();
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
	recalculateWords: function(){
		var bookId = this.get('model').id;
		var all = this.store.peekAll('bookWord').toArray();
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

window.CARD_HEIGHT = 300;
Vocabulary.LearnController = Ember.Controller.extend({
	cards:[],
	curCardIndex:0,
	showNeighbourCard: function(dir){
		var cardsCount = 3;// this.get('cards').length;
		var index = this.get('curCardIndex')+dir;
		console.log('nextCardIndex: '+index);
		if(index<0||index>=cardsCount){
			return;
		}
		this.set('curCardIndex', index);
		var scrollOffset =
			( dir>0 ?
			'+='+CARD_HEIGHT:
			'-='+CARD_HEIGHT)+'px';
		var SCROLL_TIME = 300;	// мс.
		$('.learning-cards-shadow').scrollTo(scrollOffset, SCROLL_TIME);
		$('.learning-cards').scrollTo(scrollOffset, SCROLL_TIME);
	},
	// function(index){
	// 	if(index<0 || index>(this.get('cards').length-1))
	// 		return;
	// 	this.set('cardIndex',index);
	// 	console.log('scoll to card index: '+ index);
	// },
});
Vocabulary.Book = DS.Model.extend({
    name: DS.attr("string"),
    language: DS.attr("string"),
    bookWords: DS.hasMany("bookWord")
});
Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    learnProgress: DS.attr("number"),
    translations: DS.hasMany("translation")
});
Vocabulary.Translation = DS.Model.extend({
    bookWord: DS.belongsTo("bookWord"),
    value: DS.attr("string"),
    speachPart: DS.attr("number"),
    language: DS.attr("string")
});
Vocabulary.Word = DS.Model.extend({
    value: DS.attr("string"),
    language: DS.attr("string"),
    pronunciation: DS.attr("string"),
    soundUrls: DS.attr("string"),
    pictureUrls: DS.attr("string")
});
Vocabulary.WordTranslations = DS.Model.extend({
    word: DS.attr("string"),
    wordLanguage: DS.attr("string"),
    translationLanguage: DS.attr("string"),
    translationWords: DS.attr("string"),
    translationCards: DS.attr("string")
});
Vocabulary.ApplicationRoute = Ember.Route.extend({
	setupController: function(controller, model){
	    this._super(controller, model);
	    var self = this;
	    Ember.run.schedule('afterRender', this, function () {
	    	console.log("application after render");
	    	$(window).resize(function(){
				self.setContentHeight();
			}.bind(this));
			self.setContentHeight();
	    });
	},
	setContentHeight: function(){
		var height = $(window).height()-$('#toolbox').height()-35;
		console.log('setContentHeight');
		$('#content').css('height',height+'px');
		var heightChangedEvent = new CustomEvent("heightChanged", {detail: height});
		$('#content')[0].dispatchEvent(heightChangedEvent);
	}
});
Vocabulary.BookRoute = Ember.Route.extend({
});
Vocabulary.BookIndexRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/indexRoot', { outlet: 'root' });
		this.render('book/indexToolbox', { outlet: 'toolbox' });
		this.render('book/index', { outlet: 'content' });
	},
	setupController: function(controller, model){
	    this._super(controller, model);
	    controller.recalculateWords();
	    controller.initSiteDialog();
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(controller){
		var self = this;
    	$('#content').removeClass('grey');
    	$('#toolbox').removeClass('grey');
      	$('#install_ct_alert').modalPopover({
		    target: '#word_input_form',
		    placement: 'bottom',
		    backdrop: true
		});
		window.addEventListener("message", function(event){
			if(event.origin!==window.location.origin ||
				event.data.type!=='addTranslation'){
				return;
			}
			self.get('controller').addTranslation(event.data.book,
				event.data.word,
				event.data.bookWord,
				event.data.translation);
		});
	}
});
Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet:'toolbox'});
		this.render('book/learn', {outlet:'content'});
	},
	setupController: function(controller, model){
		this._super(controller, model);
	    Ember.run.schedule('afterRender', this, function() {
	    	console.log('bind scroll');
	    	$('#content').addClass('grey');
	    	$('#toolbox').addClass('grey');
	      	$('body').on('mousewheel', function(event){
				console.log(event.originalEvent.wheelDeltaY);
				if(event.originalEvent.wheelDeltaY<0) {
					$('#learning-cards-shadow').scrollTo('+=300px', 300);
					$('#learning-cards').scrollTo('+=300px', 300);
				} else {
					$('#learning-cards-shadow').scrollTo('-=300px', 300);
					$('#learning-cards').scrollTo('-=300px', 300);
				}
	      	});
	    });
	}
});
Vocabulary.IndexRoute = Ember.Route.extend({
	model: function(params){
		return this.store.query('book', {
			language: 0
		});
	},
	afterModel: function(books, transition) {
		console.log('transition to book');
		var model = books.get('firstObject');
		this.transitionTo('book', model);
  	}
});