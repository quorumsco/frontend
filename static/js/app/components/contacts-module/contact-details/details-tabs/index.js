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
  data: function() {
    return {
      nbNotes: 0,
      nbTags: 0
    }
  },
  template: require('./template.jade')(),
  methods: {
    onClick: function(e, route) {
      e.preventDefault();
      this.$root.navigate(route, undefined, this.id);
    }
  },
  events: {
    'tabs:nb': function(nbNotes, NbTags) {
      this.nbNotes = nbNotes;
      this.nbTags = NbTags;
      return false;
    }
  }
};
