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
    'contact-infos': require('./contact-details/details-infos/index.js'),
    'contact-notes': require('./contact-details/details-notes/index.js'),
    'contact-tags': require('./contact-details/details-tags/index.js'),
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
    'contacts:showInfos': function(id) {
      this.contact_id = id;
      this.view = 'contact-infos';
      return false;
    },
    'contacts:showNotes': function(id) {
      this.contact_id = id;
      this.view = 'contact-notes';
      return false;
    },
    'contacts:showTags': function(id) {
      this.contact_id = id;
      this.view = 'contact-tags';
      return false;
    }
  }
};