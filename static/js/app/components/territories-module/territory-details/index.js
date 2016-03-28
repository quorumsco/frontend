var territory_store = require('../../../models/territory_store.js'),
  pointLocation_store = require('../../../models/pointLocation_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      view: null,
      // contact: {},
      tab: 0,
      showTabs: true
    };
  },
  props: {
    id: {
      type: Number,
      required: true
    },
    territory: {
      type: Object,
      required: true,
      twoWay: true
    }
  },
  template: require('./template.jade')(),
  components: {
    'tab-menu': require('./details-tabs/index.js'),
    'infos': require('./details-infos/index.js'),
    'polygon': require('./details-polygon/index.js'),
  },
  attached: function () {
    if (!_.isEmpty(this.territory)) {
      this.$dispatch('header:title', `${this.territory.name}`);
    }
    console.log("attached entry");
    territory_store.first(this.$root, this.id, (res) => {
      if (res == null) {
        this.$root.navigate("territories:list");
      }
      var initialize = function(ref, value) {
        return ref === undefined || ref == "" ? value : ref
      }

      res.name = initialize(res.name, "not specified");
      /*
      res.firstname = initialize(res.firstname, "not specified");
      res.mail = initialize(res.mail, "not specified");
      res.phone = initialize(res.phone, "not specified");
      res.address.city = initialize(res.address.city, "not specified");
*/
      this.$set("territory", res);
      this.$dispatch('header:title', `${res.name}`);

      console.log("pointLocation_store.find entry");
      pointLocation_store.find(this.$root, this.id, (polygon_res) => {
        this.territory.$set("polygon", polygon_res);
        this.$broadcast('tabs:nb', this.territory.polygon ? this.territory.polygon.length : 0);
      });
      console.log("pointLocation_store.find out");

    });
    console.log("attached out");
  },
  created: function() {
    console.log("created: function")
    this.$dispatch("details:created");
  },
  events: {
    'territories:showInfos': function() {
      this.view = 'infos';
      this.tab = 1;
      this.$dispatch('header:hideAdd');
      this.$dispatch('header:setSearch', 0);
      this.showTabs = true;
      return false;
    },
    
    'territories:showPolygon': function() {
      console.log("territory-details->territories:showPolygon")
      this.view = 'polygon';
      this.tab = 2;
      this.$dispatch('header:hideAdd');
      this.$dispatch('header:setSearch', 0);
      this.showTabs = true;
      return false;
    },
    'territories:hidePointLocation': function() {
      this.view = 'polygon';
      this.tab = 2;
    },
    'contacts:showPointLocation': function(id, pointlocationID) {
      this.view = 'polygon';
      this.tab = 2;
      var addFunc = function() {
        this.$root.navigate("territories:newPointLocation", undefined, id);
      }
      //this.$dispatch('header:setAdd', this.$root.path('territories:newPointLocation', id), addFunc);
      this.$dispatch('header:setSearch', 0);
    },
    'tabs:nb': function(nbPolygon) {
      console.log("tabs:nb")
      this.$broadcast('tabs:nb', nbPolygon);
      return false;
    },
    'tabs:hide': function() {
      this.showTabs = false;
      return false;
    },
    'tabs:show': function() {
      this.showTabs = true;
      return false;
    }
  }
};