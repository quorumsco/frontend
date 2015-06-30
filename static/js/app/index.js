module.exports = {
    router: null,
    el: 'app-module',
    components: {
        'contacts-module': require('./components/contacts-module')
    },
    template: require('./template.html'),
    data: {
        view: null,
        router: null
    },
    created: function() {
        this.router = require('page');

        var contacts = function() {
            this.view = 'contacts-module';
        }.bind(this);

        this.router('/contacts', contacts);
        this.router('/', '/contacts');
        this.router({hashbang: true});
    },
    events: {
        navigate: function (path) {
            this.router(path);
            return false;
        }
    }
};
