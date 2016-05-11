module.exports = {
  replace: false,
  data: function() {
    return {
      title: "",
      dropdown: false,
      addUrl: null,
      addFunc: undefined,
      add: null,
      display_search: null,
      query: null
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
    },
    search_in_name: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      this.$dispatch('contacts:search_in_name', this.query);
    },
    search_in_firstname: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      this.$dispatch('contacts:search_in_firstname', this.query);
    },
    search_in_fullname: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      this.$dispatch('contacts:search_in_fullname', this.query);
    },
    search_in_address: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      this.$dispatch('contacts:search_in_address', this.query);
    },
    search: function(e) {
      if (e != undefined) {
        e.preventDefault();
      }
      this.$dispatch('contacts:search', this.query);
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
    },
   'header:setSearch': function(bool) {
      if (bool == 0) {
        this.display_search = false;
      } else if (bool == 1) {
        this.display_search = true;
      }
      return false;
    }
  }
};