module.exports = {
  inherit: true,
  replace: true,
  template: require('./template.jade')(),
  methods: {
    onClick: function(e) {
      e.preventDefault();
      return this.selected = !this.selected;
    }
  }
};
