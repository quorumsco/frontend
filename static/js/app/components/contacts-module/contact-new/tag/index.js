module.exports = {
  data: function() {
  	return {
  		newTag: {
  			name: null
  		}
  	}
  },
  methods: {
  	createTag: function(tag, e) {
  	  e.preventDefault();
      this.$parent.addTag(tag);
      this.newTag = this.baseTag();
  	},
  	baseTag: function() {
      return {
        name: null,
      }
    }
  },
  template: require('./template.jade')()
};
