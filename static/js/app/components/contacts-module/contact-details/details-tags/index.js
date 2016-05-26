  var tags_store = require('../../../../models/tags_store.js'),
  _ = require('lodash');

module.exports = {
  props: {
    contact: {
      type: Object,
      required: true,
      twoWay: true
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
          var index = _.findIndex(arr, key);
          arr.splice(index, 1);
        }
      };
      tags_store.delete(this.$root, this.contact.id, tag, () => {
        remove(this.contact.tags, tag.$data);
        this.$dispatch('tabs:nb', this.contact.notes ? this.contact.notes.length : 0,this.contact.formdatas ? this.contact.formdatas.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      });
    }
  }
};
