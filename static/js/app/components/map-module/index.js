module.exports = {
  replace: false,
  template: require('./template.html'),
  attached: function() {
    require('./map.js')();
  }
}
