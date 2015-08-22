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
   	  contact: {},
      view: null
    };
  },
  template: require('./template.jade')(),
    components: {
    'tab-menu': require('../details-tabs/index.js')
  },
  compiled: function () {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$emit("data-loaded");
    }
    contact_store.first(this.id, (res) => {
      this.contact = res;
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$emit("data-loaded");
    });
  }
};