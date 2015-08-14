module.exports = {
  data: function() {
    return {
      title: "",
      prev: false,
      dropdown: false
    };
  },
  template: require('./template.jade')(),
  components: {
    'app-overlay': require('../app-overlay/index.js')
  },
  methods: {
    set: function(title) {
      this.title = title;
    },
    showDropdown: function() {
      this.dropdown = true;
    },
    hideDropdown: function(e) {
      this.dropdown = false;
    }
  },
  events: {
    'contacts:list': function() {
      this.prev = false;
    },
    'contacts:show': function() {
      this.prev = true;
    },
  }
};
