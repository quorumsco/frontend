var API = {
  'app:login': function() {
    return '/login';
  },
  'app:logout': function() {
    return '/logout';
  },
  'contacts:list': function() {
    return '/contacts';
  },
  'contacts:new': function() {
    return '/contacts/new';
  },
  'contacts:newNote': function(id) {
    return `/contacts/${id}/notes/new`;
  },
  'contacts:newTag': function(id) {
    return `/contacts/${id}/tags/new`;
  },
  'contacts:showDetails': function(id) {
    return `/contacts/${id}/infos`;
  },
  'contacts:showNote': function(id, noteID) {
    return `/contacts/${id}/notes/${noteID}`;
  },
  'contacts:showNotes': function(id) {
    return `/contacts/${id}/notes`;
  },
  'contacts:showTags': function(id) {
    return `/contacts/${id}/tags`;
  },
  'ciblage:show': function() {
    return `/map`;
  }
};
var session_store = require('../../models/session_store.js');
var _ = require('lodash');

module.exports = {
  replace: false,
  el: 'app-module',
  components: {
    'app-header': require('./app-header/index.js'),
    'nav': require('./app-nav/index.js'),
    'app-main': require('./app-main/index.js'),
    'app-overlay': require('./app-overlay/index.js'),
    'app-login': require('./app-login/index.js')
  },
  template: require('./template.jade')(),
  data: {
    router: require('page'),
    login: false,
    me: null
  },
  ready: function() {
    //Test de connexion
    var error = function(root) {
      root.navigate('app:login');
    }
    session_store.me((res, root) => {
      if (this.login == true) {
        this.login = false
        this.$on("main:created", (child) => {
          root.navigate("contacts:list");
          this.$off("main:created");
        });
      }
      this.$set("me", res);
    }, error, this.$root);

    this.router('/contacts', () => {
      if (this.$.main) {
        this.$.main.map = false;
        this.$.main.contacts = true;
      }
      this.$broadcast('contacts:list');
    });
    this.router('/map', () => {
      this.$.main.map = true;
      this.$.main.contacts = false;
    });
    this.router('/contacts/new', () => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:new');
    });
    this.router('/contacts/:id', (ctx) => {
      this.$root.navigate('contacts:showDetails', undefined, ctx.params.id);
    });
    this.router('/contacts/:id/infos', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:showInfos', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/tags', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:showTags', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/tags/new', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:newTag', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/notes', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:showNotes', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/notes/new', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:newNote', parseInt(ctx.params.id));
    });
    this.router('/contacts/:id/notes/:noteID', (ctx) => {
      this.$.main.map = false;
      this.$.main.contacts = true;
      this.$broadcast('contacts:showNote', parseInt(ctx.params.id), parseInt(ctx.params.noteID));
    });
    this.router('/login', (ctx) => {
      this.login = true;
    });
    this.router('/logout', (ctx) => {
      session_store.delSession(this, (app) => {
        app.login = true;
      });
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
      console.log(name);
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
    'header:setAdd': function(url, addFunc) {
      this.$.header.$emit('header:setAdd', url, addFunc);
      return false
    },
    'header:hideAdd': function() {
      this.$.header.$emit('header:hideAdd');
      return false
    },
    'header:setSearch': function(bool) {
      this.$.header.$emit('header:setSearch', bool);
      return false
    },
    'header:title': function(title) {
      this.$.header.set(title);
    },
    'contacts:hideNote': function(id) {
      this.$broadcast("contacts:hideNote", id);
    },
    'contacts:search': function(query) {
      this.$broadcast("contacts:search", query);
    }
  }
};
