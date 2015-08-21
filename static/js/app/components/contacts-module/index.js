var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      contacts: [],
      view: null,
      contact_id: null,
      contact: {}
    };
  },
  template: require('./template.jade')(),
  created: function() {
    this.$on("child-click", (child) => {
      this.contact = child;
    })
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    'contact-details': require('./contact-details/index.js'),
    'contact-new': require('./contact-new/index.js')
  },
  events: {
    'contacts:list': function() {
      this.view = 'contact-list';
      this.$dispatch('header:title', "Contacts");
      return false;
    },
    'contacts:new': function() {
      this.view = 'contact-new';
      return false;
    },
    'contacts:show': function(id) {
      this.contact_id = id;
      this.view = 'contact-details';
      return false;
    }
  }
};