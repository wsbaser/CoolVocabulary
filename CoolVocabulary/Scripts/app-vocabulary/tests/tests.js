setResolver(Ember.DefaultResolver.create({ namespace: Vocabulary }));

moduleForComponent('learning-calendar','Integration | Component | learning calendar',  {
  integration: true
});

test( "hello test", function( assert ) {
	var component = this.render('<learning-calendar/>');
	equal(this.$('.month').text(), 'January - 450|90');
});