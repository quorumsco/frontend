var contact_store = require('../../models/contact_store.js'),
  _ = require('lodash'),
  upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.findIndex(arr, key);
        arr.splice(index, 1, newval);
    } else {
        arr.push(newval);
    }
};

module.exports = {
  data: function() {
    return {
      contacts: [],
      view: "contact-list",
      contact_id: null,
      contact: {},
      details_event: null
    };
  },
  template: require('./template.jade')(),
  created: function() {
    this.$on("child-click", (child) => {
      this.contact = child;
    });
    this.$on("details:created", (child) => {
      this.$broadcast(this.details_event);
      this.$off("details:created");
    });
  },
  components: {
    'contact-list': require('./contact-list/index.js'),
    'contact-details': require('./contact-details/index.js'),
    'contact-new': require('./contact-new/index.js')
  },
  events: {
    'contacts:list': function() {
      this.view = 'contact-list';
      this.$dispatch('header:title', "Contacts");
      return false;
    },
    'contacts:new': function() {
      this.view = 'contact-new';
      return false;
    },
    'contacts:showInfos': function(id) {
      this.contact_id = id;
      this.details_event = "contacts:showInfos";
      this.view = 'contact-details';
    },
    'contacts:showNotes': function(id) {
      this.contact_id = id;
      this.details_event = "contacts:showNotes";
      this.view = 'contact-details';
    },
    'contacts:showTags': function(id) {
      this.contact_id = id;
      this.details_event = "contacts:showTags";
      this.view = 'contact-details';
    },
    'contacts:update': function(contact) {
      upsert(this.contacts, {id: contact.id}, contact);
      //save in the store
      return false;
    },
    'tabs:nb': function(nbNotes, nbTags) {
      this.$dispatch('tabs:nb', nbNotes, nbTags);
      return false;
    }
  }
};