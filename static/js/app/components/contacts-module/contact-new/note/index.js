module.exports = {
  data: function() {
    return {
      newNote: this.baseNote(),
      url: this.$root.path("contacts:showNotes", this.$parent.contact_id)
    }
  },
  template: require('./template.jade')(),
  methods: {
    createNote: function(note, e) {
      e.preventDefault();
      note.author = this.$root.me.firstname + " " + this.$root.me.surname;
      this.$parent.addNote(note);
      this.newNote = this.baseNote();
    },
    back: function(e) {
      e.preventDefault();
      this.$root.navigate("contacts:showNotes", undefined, this.$parent.contact_id);
    },
    baseNote: function() {
      return {
        author: null,
        date: null,
        content: null,
        id: null 
      }
    }
  }
};
