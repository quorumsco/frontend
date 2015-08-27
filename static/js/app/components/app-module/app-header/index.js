module.exports = {
  data: function() {
    return {
      title: "",
      prev: false,
      dropdown: false,
      prevEvent: null,
      prevUrl: null,
      cb: undefined
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
      this.cb();
      // this.$root.navigate(this.prevEvent);
    },
    navOnClickIn: function(e) {
      e.preventDefault();
      this.$dispatch('nav:show');
    },
    dropdownOnClick: function(e) {
      e.preventDefault();
      this.$dispatch('dropdown:show');
    }
  },
  events: {
    'contacts:list': function() {
      this.prev = false;
    },
    'contacts:showInfos': function() {
      this.prev = true;
      this.prevEvent = "contacts:list";
      this.prevUrl = this.$root.path(this.prevEvent);
      this.cb = function() {
        this.$root.navigate(this.prevEvent);
      }
    },
    'contacts:showNotes': function() {
      this.prev = true;
      this.prevEvent = "contacts:list";
      this.prevUrl = this.$root.path(this.prevEvent);
      this.cb = function() {
        this.$root.navigate(this.prevEvent);
      }
    },
    'contacts:showTags': function() {
      this.prev = true;
      this.prevEvent = "contacts:list";
      this.prevUrl = this.$root.path(this.prevEvent);
      this.cb = function() {
        this.$root.navigate(this.prevEvent);
      }
    },
    'header:setPrev': function(url, cb) {
      this.prev = true;
      this.prevUrl = url;
      this.cb = cb;
      return false;
    },
  }
};