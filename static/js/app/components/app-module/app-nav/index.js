module.exports = {
  replace: false,
  data: function() {
    return {
      show_nav: false
    };
  },
  template: require('./template.jade')(),
  components: {
    'app-overlay': require('../app-overlay/index.js')
  },
  methods: {
    show: function() {
      this.show_nav = true;
    },
    hide: function() {
      this.show_nav = false;
    }
  }
};
