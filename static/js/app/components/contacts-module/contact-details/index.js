var contact_store = require('../../../models/contact_store.js'),
  _ = require('lodash');

module.exports = {
  data: function() {
    return {
      view: null,
      contact: {},
      tab: 0
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
    'details-infos': require('./details-infos/index.js'),
    'details-notes': require('./details-notes/index.js'),
    'details-tags': require('./details-tags/index.js')
  },
  attached: function () {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
    contact_store.first(this.id, (res) => {
      this.contact = res;
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
    });
  },
  created: function() {
    this.$dispatch("details:created");
  },
  events: {
    'contacts:showInfos': function(id) {
      this.view = 'details-infos';
      this.tab = 1;
      return false;
    },
    'contacts:showNotes': function(id) {
      this.view = 'details-notes';
      this.tab = 2;
      return false;
    },
    'contacts:showTags': function(id) {
      this.view = 'details-tags';
      this.tab = 3;
      return false;
    },
    'tabs:nb': function(nbNotes, nbTags) {
      this.$broadcast('tabs:nb', nbNotes, nbTags);
      return false;
    }
  }
};