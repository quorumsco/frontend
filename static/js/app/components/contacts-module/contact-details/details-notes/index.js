  var contact_store = require('../../../../models/contact_store.js'),
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
  props: {
    contact: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      focus: false,
      note: {}
    }
  },
  created: function() {
    this.$dispatch("details:created");
  },
  template: require('./template.jade')(),
  methods: {
    deleteNote: function(e) {
      e.preventDefault();
      var remove = function (arr, key) {
        var match = _.find(arr, key);
        if (match) {
          _.remove(arr, key);
          // arr.$remove(key);
        }
      };
      remove(this.contact.notes, {id: this.note.id});
      this.$dispatch('contacts:update', this.contact);
      this.$root.$emit("contacts:hideNote");
      this.$root.navigate('contacts:showNotes', undefined, this.id);
    },
    showNote: function(e, note) {
      e.preventDefault();
      this.$root.navigate('contacts:showNote', e, this.id, note.id);
    },
    updateNote: function() {
      upsert(this.contact.notes, {id: this.note.id}, this.note);
      this.$dispatch('contacts:update', this.contact);
    }
  },
  events: {
    'contacts:showNote': function(id, noteID) {
      this.$set("focus", true);
      this.$set("note", _.cloneDeep(_.find(this.contact.notes, {id: noteID})));
      this.$dispatch("tabs:hide");
      var cb = function()  {
        this.$dispatch("contacts:hideNote");
        this.$root.navigate('contacts:showNotes', undefined, id);
      }
      this.$dispatch('header:setPrev', this.$root.path('contacts:showNotes', id), cb);
      this.$dispatch('header:title', "Note");
    },
    'contacts:hideNote': function(id) {
      this.$set("focus", false);
      this.$dispatch("tabs:show");
      this.$dispatch('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
    }
  }
};
