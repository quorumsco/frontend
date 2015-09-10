var casual = require('chance');

module.exports = {
  data: function() {
  	return {
  		newTag: {
  			name: null,
  			color: null,
  			id: null
  		}
  	}
  },
  methods: {
  	createTag: function(tag, e) {
  	  e.preventDefault();
      tag.color = chance.color({format: 'hex'})
      this.$parent.addTag(tag);
      this.newTag = this.baseTag();
  	},
  	baseTag: function() {
      return {
        name: null,
        color: null,
        id: null
      }
    }
  },
  template: require('./template.jade')()
};