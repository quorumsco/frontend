module.exports = {
  replace: false,
  template: require('./index.html'),
  attached: function() {
	cartoQuorum.createMap();
  }
}
