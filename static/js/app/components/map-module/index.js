module.exports = {
  replace: false,
  template: require('./index.html'),
  attached: function() {
  	this.$dispatch('header:title', "Ciblage");
  	this.$dispatch('header:hideAdd');
	cartoQuorum.createMap();
  }
}
