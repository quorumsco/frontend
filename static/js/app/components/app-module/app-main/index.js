module.exports = {
  replace: false,
  template: require('./template.jade')(),
  components: {
    'app-overlay': require('../app-overlay/index.js'),
    'contacts-module': require('../../contacts-module/index.js')
  },
  events: {
    'overlay:show': function(darken) {
      this.$.overlay.$emit('overlay:show', darken);
      return false;
    }
  }
};
