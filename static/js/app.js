var Vue = require('vue');
Vue.config.debug = true;
var app = new Vue(require('./app/index.js'));

var _ = require('lodash');

var upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.indexOf(arr, _.find(arr, key));
        arr.splice(index, 1, newval);
    } else {
        arr.push(newval);
    }
};

_.mixin({ '$upsert': upsert });
