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
    },
    navOnClickOut: function(e) {
      e.preventDefault();
      this.$root.navigate('contacts:list');
    },
    navOnClickIn: function(e) {
      e.preventDefault();
      this.$dispatch('nav:show')
    },
    dropdownOnClick: function(e) {
      e.preventDefault();
      this.$dispatch('dropdown:show')
    }
  },
  events: {
    'contacts:list': function() {
      this.prev = false;
    },
    'contacts:showInfos': function() {
      this.prev = true;
    },
    'contacts:showNotes': function() {
      this.prev = true;
    },
    'contacts:showTags': function() {
      this.prev = true;
    },

  }
};
