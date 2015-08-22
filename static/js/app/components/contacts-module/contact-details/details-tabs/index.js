module.exports = {
  props: {
    id: {
      type: Number,
      required: true
    },
    tab: {
      type: Number,
      required: true
    }
  },
  template: require('./template.jade')(),
  methods: {
    onClick: function(e, route) {
      e.preventDefault();
      this.$root.navigate(route, undefined, this.id);
    }
  },
  compiled: function () {

    return
  }
};
