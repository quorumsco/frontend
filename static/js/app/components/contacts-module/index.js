var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      contacts: [],
      view: null,
      contact_id: null
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
  computed: {
    contact: function() {
      _.find(this.contacts, {'id': this.contact_id});
    }
  },
  methods: {
    fetchContacts: function() {
      contact_store.find((res) => {
        this.contacts = res;
      });
    },
    fetchContact: function(id) {
      contact_store.first(id, (res) => {
        console.log("fetchContact " + id);
        console.log(res);
      });
    },
    addContact: function(contact) {
      contact_store.save(contact, (res) => {
        this.fetchContacts();
      });
    },
    listContacts: function() {
      this.view = 'contact-list';
      this.$root.header("Contacts");
    },
    newContact: function() {
      this.view = 'contact-new';
    },
    showContact: function(id) {
      this.contact_id = id;
      console.log(id);
      this.view = 'contact-details';
      this.$root.header(`${this.contact.firstname} ${this.contact.lastname}`);
    }
  }
};
