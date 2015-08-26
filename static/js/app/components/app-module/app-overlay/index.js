module.exports = {
  data: function() {
    return {
      visible: false,
      darken: false
    };
  },
  template: require('./template.jade')(),
  methods: {
    onClick: function(e) {
      e.preventDefault();
      this.$dispatch('overlay:onclick');
    }
  },
  events: {
    'overlay:hide': function() {
      this.visible = false;
      this.darken = false;
    },
    'overlay:show': function(darken) {
      this.visible = true;
      this.darken = darken;
    }
  }
};
