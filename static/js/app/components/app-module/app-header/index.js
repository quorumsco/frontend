module.exports = {
  data: function() {
    return {
      title: "",
      prev: false,
      dropdown: false
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
    },
    toggleDropdown: function(e) {
      e.preventDefault();
      this.$dispatch('overlay:show', false);
      this.dropdown = !this.dropdown;
    }
  },
  events: {
    'over:hide': function() {
      this.dropdown = false;
    }
  }
};
