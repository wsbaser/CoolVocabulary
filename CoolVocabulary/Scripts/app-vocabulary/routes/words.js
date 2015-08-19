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
