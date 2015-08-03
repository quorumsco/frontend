module.exports = {
  el: 'app-module',
  components: {
    'contacts-module': require('./components/contacts-module/index.js')
  },
  template: require('./template.jade')(),
  data: {
    view: null,
    router: require('page'),
    show_nav: true
  },
  ready: function() {
    this.router('/contacts', () => {
      this.view = 'contacts-module';
      this.$.contacts.listContacts();
    });
    this.router('/contacts/new', () => {
      this.view = 'contacts-module';
      this.$.contacts.newContact();
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
    },
    navigate: function (path, event) {
      if (event !== undefined) {
        event.preventDefault();
      }
      this.$emit('navigate', path);
    }
  },
  events: {
    navigate: function(path) {
      this.router(path);
      return false;
    }
  }
};
