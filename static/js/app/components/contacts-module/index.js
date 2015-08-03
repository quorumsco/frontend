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
      view: null,
      select_all: false
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
        this.contacts = _(res).forEach(function(n) {
          n = _.assign(n, {selected: false});
        }).value();
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
