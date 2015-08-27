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
  template: require('./template.jade')(),
  methods: {
    updateContact: function() {
      this.$dispatch('contacts:update', this.contact);
    },
    revertContact: function() {
      contact_store.first(this.id, (res) => {
        this.contact = res;
        this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      });
    }
  }
};