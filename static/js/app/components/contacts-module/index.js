var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  props: ['view', 'router'],
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
    this.fetchContacts();
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    'contact-details': require('./contact-details/index.js'),
    'contact-create': require('./contact-create/index.js')
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
    navigate: function (path, event) {
      if (event !== undefined) {
        event.preventDefault();
      }
      this.$dispatch('navigate', path);
    },
    listContacts: function() {
      this.view = 'contact-list';
    },
    createContact: function() {
      this.view = 'contact-create';
    },
    showContact: function(contact) {
      this.contact_id = contact.id;
      this.view = 'contact-details';
    }
  }
};
