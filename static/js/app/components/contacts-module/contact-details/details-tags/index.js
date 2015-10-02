  var tags_store = require('../../../../models/tags_store.js'),
  _ = require('lodash');

module.exports = {
  props: {
    contact: {
      type: Object,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  template: require('./template.jade')(),
  methods: {
    deleteTag: function(e, tag) {
      e.preventDefault();
      var remove = function (arr, key) {
        var match = _.find(arr, key);
        if (match) {
          arr.$remove(key);
        }
      };
      tags_store.delete(this.contact.id, tag, () => {
        remove(this.contact.tags, tag.$data);
        this.$dispatch("contacts:vueUpdate", this.contact);
        this.$dispatch('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      });
    }
  }
};
