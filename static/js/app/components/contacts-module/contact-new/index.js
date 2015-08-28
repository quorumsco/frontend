module.exports = {
  replace: false,
  data: function() {
    return {
      contact: this.baseContact()
    };
  },
  template: require('./template.jade')(),
  methods: {
    submit: function(contact, event) {
      event.preventDefault();
      this.$parent.addContact(contact);
      this.contact = this.baseContact();
    },
    baseContact: function() {
      return {
        firstname: null,
        surname: null,
        phone: null
      };
    }
  }
};
