var contact_store = require('../../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  replace: false,
  props: {
    addresses: {
      type: Array,
      required: true
    }
  },
  data: function() {
    return {
      select_all: false
    };
  },
  compiled: function() {
    console.debug("compiled contact-list");
    if (this.addresses.length == 0) {
      contact_store.find(this.$root, (res) => {
        // var byName = res.slice(0);
        // byName.sort(function(a,b) {
        //   var x = a.surname.toLowerCase();
        //   var y = b.surname.toLowerCase();
        //   return x < y ? -1 : x > y ? 1 : 0;
        // });
        this.$set("addresses", res.slice(0));
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
    addressCount: function() {
      return this.addresses.length;
    },
    selectedCount: function() {
      return _.size(_.filter(this.addresses, 'selected', true), 'id');
    }
  }
};
