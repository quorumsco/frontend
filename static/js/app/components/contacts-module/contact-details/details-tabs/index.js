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
      url: this.$root.path("contacts:list"),
      nbNotes: 0,
      nbTags: 0
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
      this.$root.navigate("contacts:list");
    }
  },
  events: {
    'tabs:nb': function(nbNotes, nbTags) {
      this.nbNotes = nbNotes;
      this.nbTags = nbTags;
      return false;
    },
    'tabs:setPrev': function(url, prevFunc) {
      this.prev = true;
      this.prevUrl = url;
      this.prevFunc = prevFunc;
      return false;
    },
    'tabs:hidePrev': function(url, prevFunc) {
      this.prev = false;
      return false;
    }
  }
};