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
      console.log(this.$parent)
      event.preventDefault();
      this.$parent.addContact(contact);
      this.contact = this.baseContact();
    },
    baseContact: function() {
      return {
        firstname: null,
        surname: null,
        email: null,
        phone: null,
        adress: null
      };
    }
  }
};
