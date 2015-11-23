module.exports = {
  data: function() {
    return {
      contact: this.baseContact()
    };
  },
  template: require('./template.jade')(),
  methods: {
    submit: function(contact, e) {
      e.preventDefault();
      this.$parent.addContact(contact);
      this.contact = this.baseContact();
    },
    back: function(e) {
      e.preventDefault();
      this.$root.navigate("contacts:list");
    },
    baseContact: function() {
      return {
        firstname: null,
        surname: null,
        mail: null,
        phone: null,
        address: {housenumber: null, street: null, postalcode: null, city: null},
        vote: "maybe",
        support: "maybe"
      };
    }
  }
};
