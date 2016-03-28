module.exports = {
  replace: false,
  data: function() {
    return {
      contacts: false,
      map: true
    }
  },
  attached: function() {
    this.$dispatch("main:created");
  },
  template: require('./template.jade')(),
  components: {
    'app-overlay': require('../app-overlay/index.js'),
    'contacts-module': require('../../contacts-module/index.js'),
    'map-module': require('../../map-module/index.js')
  },
  events: {
    'overlay:show': function(darken) {
      this.$.overlay.$emit('overlay:show', darken);
      return false;
    }
  }
};
