var _ = require('lodash');

module.exports = {
  props: {
    contacts: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      select_all: false
    };
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
