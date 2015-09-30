var contact_store = require('../../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  replace: false,
  props: {
    contacts: {
      type: Array,
      required: true
    },
    contact: {
      type: Object,
      required: true
    }
  },
  data: function() {
    return {
      select_all: false
    };
  },
  compiled: function() {
    if (this.contacts.length == 0) {
      contact_store.find((res) => {
        this.$set("contacts", res);
        console.log(this.contacts);
      });
    }
  },
  template: require('./template.jade')(),
  components: {
    'list-item': require('./list-item/index.js')
  },
  watch: {
    'select_all': function (val) {
      this.$broadcast('select', val);
    }
  },
  computed: {
    contactCount: function() {
      return this.contacts.length;
    },
    selectedCount: function() {
      return _.size(_.filter(this.contacts, 'selected', true), 'id');
    }
  }
};
