module.exports = {
  replace: false,
  template: require('./index.html'),
  attached: function() {
    L = require('./carto.js');
  }
}
