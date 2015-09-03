var session_store = require('../../../models/session_store.js');

module.exports = {
  replace: false,
  template: require('./template.jade')(),
  data: function() {
  	return {
  		user: {
  			username: null,
  			password: null
  		}
  	}
  },
  methods: {
  	logIn: function(e) {
  		e.preventDefault();
  		var cb = function() {
  			console.log("Youpi")
  		}
  		var error = function() {
  			console.log("Merde")
  		}
  		session_store.getSession(this.user, cb, error);
  	}
  }
};
