var casual = require('chance');

module.exports = {
  data: function() {
  	return {
  		newTag: this.baseTag(),
      url: this.$root.path("contacts:showTags", this.$parent.contact_id)
  	}
  },
  methods: {
  	createTag: function(tag, e) {
  	  e.preventDefault();
      tag.color = chance.color({format: 'hex'})
      this.$parent.addTag(tag);
      this.newTag = this.baseTag();
  	},
    back: function(e) {
      e.preventDefault();
      this.$root.navigate("contacts:showTags", undefined, this.$parent.contact_id);
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