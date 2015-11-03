var contact_store = require('../../models/contact_store.js'),
  note_store = require('../../models/note_store.js'),
  tags_store = require('../../models/tags_store.js'),
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
    this.$root.navigate("contacts:new");
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
      contacts: [],
      view: "list",
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
      this.details_event();
      this.$off("details:created");
    });
  },
  attached: function() {
    if (this.view == 'list') {
      this.$dispatch('header:title', "Contacts");
      this.$dispatch('header:setAdd', this.$root.path('contacts:new'), addFunc);
    }
  },
  components: {
    'list': require('./contact-list/index.js'),
    'details': require('./contact-details/index.js'),
    'new': require('./contact-new/index.js'),
    'newNote': require('./contact-new/note/index.js'),
    'newTag': require('./contact-new/tag/index.js')
  },
  methods: {
    findContact: function() {
      return _.find(this.contacts, {id: this.contact_id});
    },
    addContact: function(contact) {
      contact_store.save(contact, (res) => {
        upsert(this.contacts, {id: res.body.data.contact.id}, res.body.data.contact);
      });
    },
    addNote: function(note) {
      this.contact = this.findContact();
      note_store.save(this.contact_id, note, (res) => {
        upsert(this.contact.notes, {id: res.body.data.note.id}, res.body.data.note);
        upsert(this.contacts, {id: this.contact.id}, this.contact);
      });
    },
    addTag: function(tag) {
      this.contact = this.findContact();
      tags_store.save(this.contact_id, tag, (res) => {
        upsert(this.contact.tags, {id: res.body.data.tag.id}, res.body.data.tag);
        upsert(this.contacts, {id: this.contact.id}, this.contact);
      });
    },
    setNew: function(view, title, id, bool) {
      this.view = view;
      this.contact_id = id;
      this.$dispatch('header:title', title);
      this.$dispatch('header:hideAdd');
      this.$dispatch('header:hidePrev');
      this.$dispatch('header:setSearch', bool);
    }
  },
  events: {
    'contacts:search': function(query) {
      search.find(query, (res) => {
        this.$set("contacts", res);
      });
      return false;
    },
    'contacts:list': function() {
      this.view = 'list';
      this.$dispatch('header:title', "Contacts");
      this.$dispatch('header:setAdd', this.$root.path('contacts:new'), addFunc);
      this.$dispatch('header:setSearch', 1);
      console.log("prout")
      return false;
    },
    'contacts:new': function() {
      this.setNew("new", "New Contact", 0, 0);
      return false;
    },
    'contacts:showInfos': function(id) {
      this.contact_id = id;
      this.details_event = function() {
        this.$broadcast("contacts:showInfos");
       }
      this.view = 'details';
    },
    'contacts:showNotes': function(id) {
      this.contact_id = id;
      this.details_event = function() {
        this.$broadcast("contacts:showNotes", id);
       }
      this.view = 'details';
    },
    'contacts:newNote': function(id) {
      this.setNew("newNote", "New Note", id, 0);
      return false;
    },
    'contacts:showNote': function(id, noteID) {
      this.contact_id = id;
      this.details_event = function() {
        this.$broadcast("contacts:showNote", id, noteID);
       }
      this.view = 'details';
    },
    'contacts:hideNote': function(id) {
      this.contact_id = id;
      this.details_event = function() {
        this.$broadcast("contacts:hideNote", id);
       }
      this.view = 'details';
    },
    'contacts:showTags': function(id) {
      this.contact_id = id;
      this.details_event = function() {
        this.$broadcast("contacts:showTags", id);
       }
      this.view = 'details';
    },
    'contacts:newTag': function(id) {
      this.setNew("newTag", "New Tag", id, 0);
      return false;
    },
    'contacts:update': function(contact) {
      var tags = contact.tags;
      var notes = contact.notes;
      contact.tags = undefined;
      contact.notes = undefined;
      contact_store.update(contact, (res) => {
        upsert(this.contacts, {id: contact.id}, contact);
      });
      contact.tags = tags;
      contact.notes = notes;
      return false;
    },
    'contacts:remove': function(id) {
      remove(this.contacts, {id: id});
      return false;
    },
    'tabs:nb': function(nbNotes, nbTags) {
      this.$dispatch('tabs:nb', nbNotes, nbTags);
      return false;
    }
  },
};