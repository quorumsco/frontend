  var contact_store = require('../../../../models/contact_store.js'),
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
  data: function() {
    return {
      contact: {},
      view: null
    };
  },
  template: require('./template.jade')(),
  components: {
    'tab-menu': require('../details-tabs/index.js')
  },
  methods: {
    updateContact: function() {
      this.$dispatch('contacts:update', this.contact);
    },
    revertContact: function() {
      contact_store.first(this.id, (res) => {
        this.contact = res;
        this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
        this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      });
    }
  },
  compiled: function () {
    if (!_.isEmpty(this.contact)) {
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
    contact_store.first(this.id, (res) => {
      this.contact = res;
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
      this.$broadcast('tabs:nb', this.contact.notes ? this.contact.notes.length : 0, this.contact.tags ? this.contact.tags.length : 0);
    });
  }
};