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
    this.router('/contacts', this.listContacts);
    this.router('/contacts/create', this.createContact);
    this.router('/contacts/:id', this.showContact);
    this.router('/', '/contacts');
    this.fetchContacts();
    this.listContacts();
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
      event.preventDefault();
      this.$dispatch('navigate', path);
    },
    listContacts: function() {
      this.router('/contacts');
      this.view = 'contact-list';
    },
    createContact: function() {
      this.router('/contacts/create');
      this.view = 'contact-create';
    },
    showContact: function(id) {
      this.router(`/contacts/${id}`);
      this.contact_id = id;
      this.view = 'contact-details';
    }
  },
  events: {
    'contacts:list': function() {
      this.listContacts();
    }
  }
};
