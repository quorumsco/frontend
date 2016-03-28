var territory_store = require('../../models/territory_store.js'),
  search = require('../../models/search.js'),
  _ = require('lodash'),
  upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.findIndex(arr, key);
        arr.splice(index, 1, newval);
    } else if (arr) {
      arr.push(newval);
    }
  },
  addFunc = function() {
    this.$root.navigate("territories:new");
  },
  remove = function (arr, key) {
    var match = _.find(arr, key);
    if (match) {
      var index = _.findIndex(arr, key);
      arr.splice(index, 1);
    }
  };

module.exports = {
  replace: false,
  data: function() {
    return {
      territories: [],
      view: "list",
      territory_id: null,
      territory: {},
      details_event: null
    };
  },
  template: require('./template.jade')(),
  created: function() {
    this.$on("child-click", (child) => {
      this.territory = child;
    });
    this.$on("details:created", (child) => {
      this.details_event();
      this.$off("details:created");
    });
  },
  attached: function() {
    if (this.view == 'list') {
      this.$dispatch('header:title', "Territories");
      this.$dispatch('header:setAdd', this.$root.path('territories:new'), addFunc);
      this.$dispatch('header:setSearch', 1);
    }
  },
  components: {
    'list': require('./territory-list/index.js'),
    'details': require('./territory-details/index.js')
  },
  methods: {
    findTerritory: function() {
      console.log("findTerritory method -> index de territory-list");
      return _.find(this.territories, {id: this.territory_id});
    },
    addTerritory: function(territory) {
      //territory.address.country = "France"
      territory_store.save(this.$root, territory, (res) => {
        upsert(this.territories, {id: res.body.data.territory.id}, res.body.data.territory);
      });
    },
    setNew: function(view, title, id, bool) {
      this.view = view;
      this.territory_id = id;
      this.$dispatch('header:title', title);
      this.$dispatch('header:hideAdd');
      this.$dispatch('header:hidePrev');
      this.$dispatch('header:setSearch', bool);
    }
  },
  events: {
    'territories:search_in_firstname': function(query) {
      search.find(this.$root, query, (res) => {
        this.$set("territories", res);
      },new Array('name'));
      return false;
    },'territories:search_in_name': function(query) {
      search.find(this.$root, query, (res) => {
        this.$set("territories", res);
      },new Array('name'));
      return false;
    },
    'territories:search': function(query) {
      search.find(this.$root, query, (res) => {
        this.$set("territories", res);
      },new Array('all'));
      return false;
    },
    'territories:list': function() {
      console.log("territories:list");
      this.view = 'list';
      this.$dispatch('header:title', "Territories");
      this.$dispatch('header:setAdd', this.$root.path('territories:new'), addFunc);
      this.$dispatch('header:setSearch', 0);
      return false;
    },
    'territories:showPolygon': function(id) {
      this.territory_id = id;
      this.details_event = function() {
        this.$broadcast("territories:showPolygon", id);
       }
      this.view = 'details';
    },
    'contacts:showPointLocation': function(id, noteID) {
      this.territory_id = id;
      this.details_event = function() {
        this.$broadcast("territories:showPointLocation", id, pointLocationID);
       }
      this.view = 'carte';
    },
    'territories:new': function() {
      this.setNew("new", "New Territory", 0, 0);
      return false;
    },
    'territories:showInfos': function(id) {
      this.territory_id = id;
      this.details_event = function() {
        this.$broadcast("territories:showInfos");
       }
      this.view = 'details';
    },
    'territories:update': function(contact) {
      var tags = contact.tags;
      var notes = contact.notes;
      contact.tags = undefined;
      contact.notes = undefined;
      contact_store.update(this.$root, contact, (res) => {
        upsert(this.contacts, {id: contact.id}, contact);
      });
      contact.tags = tags;
      contact.notes = notes;
      return false;
    },
    'territories:remove': function(id) {
      remove(this.contacts, {id: id});
      return false;
    },
        'tabs:nb': function(nbPolygon) {
      this.$dispatch('tabs:nb', nbPolygon);
      return false;
    }
  },
};