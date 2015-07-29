var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      contacts: [],
      contact_id: null,
      new_contact: {
        firstname: null,
        surname: null,
        phone: null
      }
    };
  },
  replace: true,
  template: require('./template.jade')(),
  created: function() {
    return this.fetchContacts();
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    // 'contact-fiche': require('./contact-fiche/index.js')
  },
  methods: {
    fetchContacts: function() {
      return contact_store.find((res) => {
        var contact = 0;
        this.contacts = _(res).forEach(function(n) {
          n = _.assign(n, {
            selected: false
          });
          return contact++;
        }).value();
        this.nb_contact = contact;
      });
    },
    createContact: function(contact) {
      return contact_store.save(contact, (res) => {
        return function(res) {
          this.fetchContacts();
        };
      });
    }
  }
};
