var API = {
  'contacts:list': function() {
    return '/contacts';
  },
  'contacts:new': function() {
    return '/contacts/new';
  },
  'contacts:show': function(id) {
    return `/contacts/${id}`;
  }
};

var expr = function(name) {
  let arrity = API[name].length;
  let args = Array.apply(null, new Array(arrity)).map(function() {
    return ':id';
  });
  return API[name].apply(this, args);
};

module.exports = {
  el: 'app-module',
  components: {
    'contacts-module': require('./components/contacts-module/index.js'),
    'app-header': require('./components/app-module/app-header/index.js')
  },
  template: require('./template.jade')(),
  data: {
    view: null,
    router: require('page'),
    show_nav: true
  },
  ready: function() {
    this.router(expr('contacts:list'), () => {
      this.view = 'contacts-module';
      this.$.contacts.listContacts();
      this.$.header['contacts:list']();
    });
    this.router(expr('contacts:new'), () => {
      this.view = 'contacts-module';
      this.$.contacts.newContact();
    });
    this.router(expr('contacts:show'), (ctx) => {
      this.view = 'contacts-module';
      this.$.contacts.showContact(ctx.params.id);
      this.$.header['contacts:show']();
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
    navigate: function (name, event, ...args) {
      if (event !== undefined) {
        event.preventDefault();
      }
      this.$emit('navigate', name, ...args);
    },
    path: function(name, ...args) {
      return API[name].apply(this, args);
    },
    header: function(title) {
      this.$.header.set(title);
    }
  },
  events: {
    navigate: function(name, ...args) {
      this.router(this.path(name, ...args));
      return false;
    }
  }
};
