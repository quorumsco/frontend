var contact_store = require('../../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      view: null,
      contact: {},
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
      required: true
    }
  },
  template: require('./template.jade')(),
  components: {
    'tab-menu': require('./details-tabs/index.js'),
    'infos': require('./details-infos/index.js'),
    'notes': require('./details-notes/index.js'),
    'tags': require('./details-tags/index.js')
  },
  ready: function() {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
    contact_store.first(this.id, (res) => {
      this.$set("contact", res);
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      this.$dispatch('contacts:update', this.contact)
    });
  },
  attached: function () {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
    contact_store.first(this.id, (res) => {
      // this.$set("contact", res);
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      this.$dispatch('contacts:update', this.contact)
    });
  },
  created: function() {
    this.$dispatch("details:created");
  },
  // computed: {
  //   notesCount: function() {
  //     return this.contact.notes ? this.contact.notes.length : 0;
  //   },
  //   tagsCount: function() {
  //     return this.contact.tags ? this.contact.tags.length : 0;
  //   }
  // },
  events: {
    'contacts:showInfos': function() {
      this.view = 'infos';
      this.tab = 1;
      this.$dispatch('header:hideAdd');
      return false;
    },
    'contacts:showNotes': function(id) {
      this.view = 'notes';
      this.tab = 2;
      var addFunc = function() {
        this.$root.navigate("contacts:newNote", undefined, id);
      }
      this.$dispatch('header:setAdd', this.$root.path('contacts:newNote', id), addFunc);
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
