module.exports = {
  template: require('./template.jade')(),
  methods: {
    onClick: function(e) {
      e.preventDefault();
      this.selected = !this.selected;
      this.$root.navigate('contacts:showDetails', undefined, this.id);
      this.$dispatch('child-click', this.$data);
    }
  },
  events: {
    select: function(state) {
      this.selected = state;
    }
  }
};
