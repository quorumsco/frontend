var contact_store = require('../../models/mission_store.js'),
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
      return _.find(this.contacts, {'id': this.contact_id});
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
    }
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
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      return false;
    }
  }
};
