Vocabulary.HasActiveObject = Ember.Mixin.create({
	activeObject: Ember.computed('activeObjectIndex', function(){
		return this.get('collection').objectAt(this.get('activeObjectIndex'));
	}),
	activeObject_old: Ember.computed('activeObjectIndex_old', function(){
		return this.get('collection').objectAt(this.get('activeObjectIndex_old'));		
	}),
	activeObjectIndexObserver: Ember.observer('activeObjectIndex', function(){
		this.get('activeObject').set('isActive', true);
		var activeObject_old = this.get('activeObject_old');
		if(activeObject_old){
			activeObject_old.set('isActive', false);
		}
		this.set('activeObjectIndex_old', this.get('activeObjectIndex'));
	}),
	activateObject: function(obj){
		var objectIndex = this.get('collection').indexOf(obj);
		if(objectIndex!==-1){
			this.set('activeObjectIndex', objectIndex);
		}
	},
	activateFirstObject: function(){
		this.set('activeObjectIndex', 0);
	},
	nextObject: function(){
		var nextObjectIndex = this.get('activeObjectIndex')+1;
		var collection = this.get('collection');
		if(nextObjectIndex < collection.length){
			this.set('activeObjectIndex', nextObjectIndex);
			return true;
		}
		else{
			return false;
		}
	},
	prevObject: function(){
		var nextObjectIndex = this.get('activeObjectIndex')-1;
		if(nextObjectIndex >=0){
			this.set('activeObjectIndex', nextObjectIndex);
			return true;
		}
		else{
			return false;
		}
	},
	isLastObject: Ember.computed('activeObjectIndex', function(){
		return this.get('activeObjectIndex')===(this.get('collection').length-1);
	})
});
