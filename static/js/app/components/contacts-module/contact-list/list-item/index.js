module.exports = {
  template: require('./template.jade')(),
  methods: {
    onClick: function(e) {
      e.preventDefault();
      this.selected = !this.selected;
    }
  },
  events: {
    select: function(state) {
      this.selected = state;
    }
  }
};
