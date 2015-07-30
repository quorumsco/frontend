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
    this.router('/', () => {
      this.view = 'contacts-module';
    });

    this.router({
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
