module.exports = {
  replace: false,
  template: require('./template.html'),
  attached: function() {
  	console.log("mdr")
    require('./map.js')();
  }
}
