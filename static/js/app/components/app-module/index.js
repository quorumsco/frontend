var API = {
  'app:login': function() {
    return '/login';
  },
  'contacts:list': function() {
    return '/contacts';
  },
  'contacts:new': function() {
    return '/contacts/new';
  },
  'contacts:showDetails': function(id) {
    return `/contacts/${id}/infos`;
  },
  'contacts:showNotes': function(id) {
    return `/contacts/${id}/notes`;
  },
  'contacts:showTags': function(id) {
    return `/contacts/${id}/tags`;
  }
};

module.exports = {
  el: 'app-module',
  components: {
    'app-header': require('./app-header/index.js'),
    'app-nav': require('./app-nav/index.js'),
    'app-main': require('./app-main/index.js'),
    'app-overlay': require('./app-overlay/index.js'),
    'app-login': require('./app-login/index.js')
  },
  template: require('./template.jade')(),
  data: {
    router: require('page'),
    login: false
  },
  ready: function() {
    this.router('/contacts', () => {
      this.$.main.view = 'contacts-module';
      this.$broadcast('contacts:list');
    });
    this.router('/contacts/new', () => {
      this.$.main.view = 'contacts-module';
      this.$broadcast('contacts:new');
    });
    this.router('/contacts/:id', (ctx) => {
      this.$root.navigate('contacts:showDetails', undefined, ctx.params.id);
    });
    this.router('/contacts/:id/infos', (ctx) => {
      this.$.main.view = 'contacts-module';
      this.$broadcast('contacts:showInfos', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/tags', (ctx) => {
      this.$.main.view = 'contacts-module';
      this.$broadcast('contacts:showTags', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/notes', (ctx) => {
      this.$.main.view = 'contacts-module';
      this.$broadcast('contacts:showNotes', parseInt(ctx.params.id));
    });
    this.router('/login', (ctx) => {
      this.$.main.view = 'app-login';
    });
    this.router('/', '/contacts');

    this.router({
      hashbang: true
    });
  },
  methods: {
    navigate: function (name, event, ...args) {
      if (event !== undefined) {
        event.preventDefault();
      }
      this.$emit('navigate', name, ...args);
    },
    path: function(name, ...args) {
      return API[name].apply(this, args);
    },
    back: function() {
      window.history.back();
    }
  },
  events: {
    navigate: function(name, ...args) {
      this.router(this.path(name, ...args));
      return false;
    },
    'overlay:onclick': function() {
      this.$broadcast('overlay:hide');
      this.$.nav.hide();
      this.$.header.hideDropdown();
    },
    'nav:show': function() {
      this.$.header.$broadcast('overlay:show', true);
      this.$.main.$broadcast('overlay:show', true);
      this.$.nav.show();
    },
    'dropdown:show': function() {
      this.$.header.$broadcast('overlay:show', false);
      this.$.main.$broadcast('overlay:show', false);
      this.$.header.showDropdown();
    },
    'header:title': function(title) {
      this.$.header.set(title);
    }
  }
};
