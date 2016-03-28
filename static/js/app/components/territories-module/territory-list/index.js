var territory_store = require('../../../models/territory_store.js'),
  _ = require('lodash');

module.exports = {
  replace: false,
  props: {
    territories: {
      type: Array,
      required: true
    }
  },
  data: function() {
    console.log("index.js de territory-list-1");

    return {
      select_all: false
    };
  },
  compiled: function() {
    console.log("index.js de territory-list-1");
    if (this.territories.length == 0) {
      console.log("index.js de territory-list-2");
      territory_store.find(this.$root, (res) => {
        // var byName = res.slice(0);
        // byName.sort(function(a,b) {
        //   var x = a.surname.toLowerCase();
        //   var y = b.surname.toLowerCase();
        //   return x < y ? -1 : x > y ? 1 : 0;
        // });
        this.$set("territories", res.slice(0));
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
    territoryCount: function() {
      return this.territories.length;
    },
    selectedCount: function() {
      return _.size(_.filter(this.territories, 'selected', true), 'id');
    }
  }
};
