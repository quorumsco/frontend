module.exports = {
  router: null,
  el: 'app-module',
  components: {
    'contacts-module': require('./components/contacts-module/index.js')
  },
  template: require('./template.jade')(),
  data: {
    view: null,
    router: require('page')
  },
  created: function() {
    var contacts = () => {
      return this.view = 'contacts-module';
    };
    var new_contact = () => {
      return this.view = 'contacts-module';
    };
    this.router('/contacts', contacts);
    this.router('/contacts/new', new_contact);
    this.router('/', '/contacts');
    return this.router({
      hashbang: true
    });
  },
  events: {
    navigate: function(path) {
      this.router(path);
      return false;
    }
  }
};
