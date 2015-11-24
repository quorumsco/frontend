var Emitter = require('events').EventEmitter,
    common = module.exports = new Emitter(),
    data = "Token",
   	main = require('../components/app-module/index.js'),
	status = "fail";

common.api = 'https://api.quorumapps.com';
// common.api = 'http://localhost:8080';

common.token = function(res) {
	if(res.body.data == data && res.body.status == status) {
	 	return 1
	} else {
	 	return 0
	}
}

common.cb = function(root) {
	root.navigate('app:login');
}
