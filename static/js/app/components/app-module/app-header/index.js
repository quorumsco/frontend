module.exports = {
  replace: false,
  data: function() {
    return {
      title: "",
      dropdown: false,
      addUrl: null,
      addFunc: undefined,
      add: null
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
    hideDropdown: function() {
      this.dropdown = false;
    },
    navOnClickIn: function(e) {
      e.preventDefault();
      this.$dispatch('nav:show');
    },
    dropdownOnClick: function(e) {
      e.preventDefault();
      this.$dispatch('dropdown:show');
    },
    addOnClick: function(e) {
      e.preventDefault();
      this.addFunc();
    }
  },
  events: {
    'header:setAdd': function(url, addFunc) {
      this.add = true;
      this.addUrl = url;
      this.addFunc = addFunc;
      return false;
    },
    'header:hideAdd': function(url, addFunc) {
      this.add = false;
      return false;
    }
  }
};