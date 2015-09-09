module.exports = {
  data: function() {
    return {
      newNote: {
        author: null,
        date: null,
        content: null,
        id: null
      }
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
