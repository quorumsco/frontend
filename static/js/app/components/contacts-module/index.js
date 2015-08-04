var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      contacts: [],
      view: null
    };
  },
  template: require('./template.jade')(),
  created: function() {
    this.fetchContacts();
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    'contact-details': require('./contact-details/index.js'),
    'contact-new': require('./contact-new/index.js')
  },
  methods: {
    fetchContacts: function() {
      return contact_store.find((res) => {
        this.contacts = _(res).forEach(function(n) {
          n = _.assign(n, {selected: false});
        }).value();
      });
    },
    addContact: function(contact) {
      return contact_store.save(contact, (res) => {
        this.fetchContacts();
      });
    },
    listContacts: function() {
      this.view = 'contact-list';
    },
    newContact: function() {
      this.view = 'contact-new';
    },
    showContact: function(contact) {
      this.contact_id = contact.id;
      this.view = 'contact-details';
    }
  }
};
