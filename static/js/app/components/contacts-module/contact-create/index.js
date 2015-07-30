module.exports = {
  inherit: true,
  replace: true,
  template: require('./template.jade')(),
  methods: {
    createContact: function(contact) {
      return contact_store.save(contact, (res) => {
        return function(res) {
          this.fetchContacts();
        };
      });
    }
  }
};
