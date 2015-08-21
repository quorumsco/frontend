  var contact_store = require('../../../models/contact_store.js'),
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
      view: "details-infos"
    };
  },
  template: require('./template.jade')(),
  components: {
    'details-infos': require('./details-infos/index.js'),
    'details-tags': require('./details-tags/index.js'),
    'details-notes': require('./details-notes/index.js')
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
