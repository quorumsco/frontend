var _ = require('lodash');

module.exports = {
  props: ['contacts'],
  data: function() {
    return {
      select_all: false
    };
  },
  template: require('./template.jade')(),
  components: {
    'list-item': require('./list-item/index.js')
  },
  methods: {
    updateSelection: function(state) {
      this.$broadcast('select', state);
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
