module.exports = {
  data: function() {
    return {
      title: "",
      prev: false,
      dropdown: false,
      prevEvent: null,
      prevUrl: null,
      addUrl: this.$root.path('contacts:new'),
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
    },
    navOnClickIn: function(e) {
      e.preventDefault();
      this.$dispatch('nav:show');
    },
    dropdownOnClick: function(e) {
      e.preventDefault();
      this.$dispatch('dropdown:show');
    },
    addUser: function(e) {
      this.$root.navigate('contacts:new');
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