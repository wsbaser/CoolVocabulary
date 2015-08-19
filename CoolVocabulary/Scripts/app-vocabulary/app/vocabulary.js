window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
	this.route('words', { path:'/' });
	this.route('learn');
	this.route('exam');
});
function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector,callback){
	var self = this;
	chrome.runtime.sendMessage("cljepjpcmioifpcbdblegllafplkdphm", {
		initDialog: {
			langPair: langPair,
			attachBlockSelector: attachBlockSelector
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
	userName: 'wsbaser',
	langPair: { sourceLang:'en', targetLang:'ru' },
	book: 'Stranger in a strange land',
	init: function(){
		var self = this;
		$(document).ready(function(){
			$(window).resize(function(){
				self.setContentHeight();
			}.bind(this));
			self.setContentHeight();
		});
	}.on('init'),
	setContentHeight: function(){
		var height = $(window).height()-$('#toolbox').height();
		console.log('setContentHeight');
		$('#content').css('height',height+'px');
		var heightChangedEvent = new CustomEvent("heightChanged", {detail: height});
		$('#content')[0].dispatchEvent(heightChangedEvent);
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
			(dir>0?
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
Vocabulary.WordsController = Ember.Controller.extend({
	inputWord: "",
	translator: {},
	applicationCtrl: Ember.inject.controller('application'),
	init: function(){
		this.initSiteDialog();
	}.on('init'),
	initSiteDialog:function(){
		var self = this;
		var ctAdapter =  new CTAdapter();
		this.set('ctAdapter', ctAdapter);
		var langPair = this.get('applicationCtrl').langPair;
		$('#word_input_form').off('submit', this.showInstallCTAlert);
		ctAdapter.initSiteDialog(langPair, '#word_input_form', function(){
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
	}
});

Vocabulary.LearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('learnToolbox', {outlet:'toolbox'});
		this.render('learn',{outlet:'content'});
	}
});
Vocabulary.WordsRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('wordsRoot', { outlet: 'root' });
		this.render('wordsToolbox', { outlet: 'toolbox' });
		this.render('words', { outlet: 'content' });
		},
		setupController: function(controller, model){
	    this._super(controller, model);
	    Ember.run.schedule('afterRender', this, function () {
	    	console.log('init popover');
	      	$('#install_ct_alert').modalPopover({
			    target: '#word_input_form',
			    placement: 'bottom',
			    backdrop: true
			});
	    });
		},
	model: function(params){
		return {
			pronouns:[
				{word:'kindergarten', translation:'перевод'},
				{word:'doppelganger',translation:'перевод'},
				{word:'I',translation:'Я'},
				{word:'You',translation:'Ты'},
				{word:'He',translation:'Он'}],
			prepositions:[
				{word:'To',translation:'в'},
				{word:'At',translation:'на'},
				{word:'On',translation:'на'}],
			conjunctions:[
				{word:'And',translation:'и'},
				{word:'Or',translation:'или'},
				{word:'But',translation:'но'}],
			nouns:[
				{word:'Dog',translation:'Собака'},
				{word:'Cat',translation:'Кошка'},
				{word:'Garden',translation:'Сад'}],
			verbs:[
				{word:'Run',translation:'Бежать'},
				{word:'Go',translation:'Идти'},
				{word:'Have',translation:'Иметь'}],
			adjectives:[
				{word:'Angry',translation:'Сердитый'},
				{word:'Brave',translation:'Храбрый'},
				{word:'Healthy',translation:'Здоровый'}],
			adverbs:[
				{word:'Badly',translation:'Плохо'},
				{word:'Fully',translation:'Полностью'},
				{word:'Hardly',translation:'Едва'}],
			articles:[
				{word:'A',translation:''},
				{word:'The',translation:''},
				{word:'An',translation:''}],
			interjections:[
				{word:'aha!',translation:''},
				{word:'gosh!',translation:''},
				{word:'hi!',translation:''}]
		};
	}
});
