var contact_store = require('../../models/contact_store.js'),
_ = require('lodash');

module.exports = {
  data: function() {
    return {
      contacts: [],
      new_contact: {
        firstname: null,
        surname: null,
        phone: null
      },
      contact_id: null
    };
  },
  replace: true,
  template: require('./template.jade')(),
  created: function() {
    return this.fetchContacts();
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    'contact-fiche': require('./contact-fiche/index.coffee')
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
        return this.nb_contact = contact;
      });
    },
    createContact: function(contact) {
      return contact_store.save(contact, (res) => {
        return function(res) {
          return this.fetchContacts();
        };
      }
    }
  }
};
