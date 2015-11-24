  var note_store = require('../../../../models/note_store.js'),
  _ = require('lodash'),
  upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.findIndex(arr, key);
        arr.splice(index, 1, newval);
    } else if (arr) {
        arr.push(newval);
    }
};

module.exports = {
  props: {
    contact: {
      type: Object,
      required: true,
      twoWay: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      focus: false,
      url: this.$root.path("contacts:list"),
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
          var index = _.findIndex(arr, key);
          arr.splice(index, 1);
        }
      };
      note_store.delete(this.$root, this.contact.id, this.note.id, () => {
        remove(this.contact.notes, {id: this.note.id});
        this.$root.$emit("contacts:hideNote", this.id);
        this.$root.navigate('contacts:showNotes', undefined, this.id);
      });
    },
    showNote: function(e, note) {
      e.preventDefault();
      this.$root.navigate('contacts:showNote', e, this.id, note.id);
    },
    updateNote: function(e) {
      e.preventDefault();
      note_store.update(this.$root, this.contact.id,  this.note, (res) => {
        upsert(this.contact.notes, {id: this.note.id}, this.note);
      });
    },
    prevFunc: function(e) {
      e.preventDefault();
      this.$dispatch("contacts:hideNote", this.id);
      this.$root.navigate('contacts:showNotes', undefined, this.id);
    }
  },
  events: {
    'contacts:showNote': function(id, noteID) {
      this.$set("focus", true);
      this.$set("note", _.cloneDeep(_.find(this.contact.notes, {id: noteID})));
      this.$dispatch("tabs:hide");
      this.$dispatch('header:title', "Note");
      this.$dispatch('header:hideAdd');
      this.id = id;
    },
    'contacts:hideNote': function(id) {
      this.$set("focus", false);
      this.$dispatch("tabs:show");
      this.$dispatch('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
  }
};
