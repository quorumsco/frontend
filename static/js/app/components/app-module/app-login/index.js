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
  			// console.log(this.$root);
  		    var error = function(root) {
  		    	console.log("Error");
            root.login = true
		    }
		    session_store.me((res, root) => {
		        root.login = false;
		        root.$set("me", res);
       			root.navigate("contacts:list");
	        }, error, root);	
  		}
  		var cbError = function(err) {
  			console.log("Bad Identifiers");
  			console.log(err)
  		}
  		session_store.getSession(this.user, cb, cbError, this.$root);
  	}
  }
};
