module.exports = {
  data: function() {
    return {
      title: "",
      prev: false
    };
  },
  template: require('./template.jade')(),
  methods: {
    'contacts:list': function() {
      this.prev = false;
    },
    'contacts:show': function(name) {
      this.prev = true;
    },
    set: function(title) {
      this.title = title;
    }
  }
};
