var contact_store = require('../../../models/contact_store.js'),
  note_store = require('../../../models/note_store.js'),
  tags_store = require('../../../models/tags_store.js'),
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
    contact: {
      type: Object,
      required: true,
      twoWay: true
    }
  },
  template: require('./template.jade')(),
  components: {
    'tab-menu': require('./details-tabs/index.js'),
    'infos': require('./details-infos/index.js'),
    'notes': require('./details-notes/index.js'),
    'tags': require('./details-tags/index.js')
  },
  attached: function () {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
    contact_store.first(this.id, (res) => {
      if (res == null) {
        this.$root.navigate("contacts:list");
      }
      if (res.surname == "" || res.surname === undefined) {res.surname = "not specified"};
      if (res.firstname == "" || res.firstname === undefined) {res.firstname = "not specified";};
      if (res.mail == "" || res.mail === undefined) {res.mail = "not specified"};
      if (res.adress == "" || res.adress === undefined) {res.adress = "not specified"};
      if (res.phone == "" || res.phone === undefined) {res.phone = "not specified"};
      this.$set("contact", res);
      this.$dispatch('header:title', `${res.firstname} ${res.surname}`);
      note_store.find(this.id, (notes_res) => {
        this.contact.$set("notes", notes_res);
        tags_store.find(this.id, (tags_res) => {
          this.contact.$set("tags", tags_res);
          this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
        });
      });
    });
  },
  created: function() {
    this.$dispatch("details:created");
  },
  events: {
    'contacts:showInfos': function() {
      this.view = 'infos';
      this.tab = 1;
      this.$dispatch('header:hideAdd');
      this.showTabs = true;
      return false;
    },
    'contacts:showNotes': function(id) {
      this.view = 'notes';
      this.tab = 2;
      var addFunc = function() {
        this.$root.navigate("contacts:newNote", undefined, id);
      }
      this.$dispatch('header:setAdd', this.$root.path('contacts:newNote', id), addFunc);
      this.showTabs = true;
      return false;
    },
    'contacts:hideNote': function() {
      this.view = 'notes';
      this.tab = 2;
      var prevFunc = function() {
        this.$root.navigate("contacts:list");
      }
      this.$dispatch('header:setPrev', this.$root.path("contacts:list"), prevFunc);
    },
    'contacts:showNote': function(id, noteID) {
      this.view = 'notes';
      this.tab = 2;
      var prevFunc = function() {
        this.$root.navigate("contacts:list");
      }
      this.$dispatch('header:setPrev', this.$root.path("contacts:list"), prevFunc);
      var addFunc = function() {
        this.$root.navigate("contacts:newNote", undefined, id);
      }
      this.$dispatch('header:setAdd', this.$root.path('contacts:newNote', id), addFunc);
    },
    'contacts:showTags': function(id) {
      this.view = 'tags';
      this.tab = 3;
      var addFunc = function() {
        this.$root.navigate("contacts:newTag", undefined, id);
      }
      this.$dispatch('header:setAdd', this.$root.path('contacts:newTag', id), addFunc);
      this.showTabs = true;
      return false;
    },
    'tabs:nb': function(nbNotes, nbTags) {
      this.$broadcast('tabs:nb', nbNotes, nbTags);
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