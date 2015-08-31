module.exports = {
  replace: false,
  data: function() {
    return {
      title: "",
      prev: false,
      prevFunc: undefined,
      dropdown: false,
      prevUrl: null,
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
    navOnClickOut: function(e) {
      e.preventDefault();
      this.prevFunc();
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
      addFunc();
    }
  },
  events: {
    'contacts:list': function() {
      this.prev = false;
    },
    'contacts:showInfos': function() {
      this.prev = true;
      this.prevUrl = this.$root.path("contacts:list");
      this.prevFunc = function() {
        this.$root.navigate("contacts:list");
      }
    },
    'contacts:showNotes': function() {
      this.prev = true;
      this.prevUrl = this.$root.path("contacts:list");
      this.prevFunc = function() {
        this.$root.navigate("contacts:list");
      }
    },
    'contacts:showTags': function() {
      this.prev = true;
      this.prevUrl = this.$root.path("contacts:list");
      this.prevFunc = function() {
        this.$root.navigate("contacts:list");
      }
    },
    'header:setPrev': function(url, prevFunc) {
      this.prev = true;
      this.prevUrl = url;
      this.prevFunc = prevFunc;
      return false;
    },
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