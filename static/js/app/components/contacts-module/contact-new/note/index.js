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
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  template: require('./template.jade')(),
  methods: {
    createNote: function(note, e) {
      e.preventDefault();
      var now = new Date();
      var year = now.getFullYear();
      var month = ('0' + (now.getMonth() + 1)).slice(-2);
      var day = ('0' + now.getDate()).slice(-2);

      note.author = this.$root.me.firstname + this.$root.me.lastname;
      note.date = day + "/" + month + "/" + year;
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
