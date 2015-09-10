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
  		var cb = function(root) {
  			root.login = false
  			root.navigate("contacts:list");
  		    var error = function(root) {
  		    	console.log("Error");
		    }
		    session_store.me((res, root) => {
		        this.login = false;
		        root.$set("me", res);
	        }, error, this.$root);	
  		}
  		var cbError = function(err) {
  			console.log("Bad Identifiers");
  			console.log(err)
  		}
  		session_store.getSession(this.user, cb, cbError, this.$root);
  	}
  }
};
