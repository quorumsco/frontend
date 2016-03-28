module.exports = {
  replace: false,
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
  data: function() {
    return {
      url: this.$root.path("territories:list"),
      nbPolygon: 0,
    }
  },
  template: require('./template.jade')(),
  methods: {
    onClick: function(e, route) {
      e.preventDefault();
      this.$root.navigate(route, undefined, this.id);
    },
    prevFunc: function(e) {
      e.preventDefault();
      this.$root.navigate("territories:list");
    }
  },
  events: {
    'tabs:nb': function(nbPolygon) {
      this.nbPolygon = nbPolygon;
      return false;
    }
  }
};