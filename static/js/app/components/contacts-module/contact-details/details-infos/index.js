  var contact_store = require('../../../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  props: {
    contact: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      modifying: false
    };
  },
  template: require('./template.jade')(),
  methods: {
    updateContact: function() {
      this.$dispatch('contacts:update', this.contact);
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.modifying = false;
    },
    cancelModify: function() {
      contact_store.first(this.id, (res) => {
        this.contact = res;
        this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
        this.modifying = false;
      });
    },
    deleteContact: function() {
      contact_store.delete(this.contact.id, (res) => {
        this.$dispatch('contacts:remove', this.contact.id);
        this.$root.navigate("contacts:list");
      });
    }
  }
};
