module.exports = {
  el: 'app-module',
  replace: true,
  components: {
    'contacts-module': require('./components/contacts-module/index.js')
  },
  template: require('./template.jade')(),
  data: {
    view: null,
    router: require('page'),
    show_nav: true
  },
  created: function() {
  },
  ready: function() {
    console.log(this);
    this.router('/contacts', () => {
      this.view = 'contacts-module';
      this.$.contacts.listContacts();
    });
    this.router('/contacts/create', () => {
      this.view = 'contacts-module';
      this.$.contacts.createContact();
    });
    this.router('/contacts/:id', (id) => {
      this.view = 'contacts-module';
      this.$.contacts.showContact(id);
    });
    this.router('/', '/contacts');

    this.router({
      hashbang: true
    });
  },
  methods: {
    toggleNav: function(event) {
      event.preventDefault();
      this.show_nav = !this.show_nav;
    }
  },
  events: {
    navigate: function(path) {
      this.router(path);
      return false;
    }
  }
};
