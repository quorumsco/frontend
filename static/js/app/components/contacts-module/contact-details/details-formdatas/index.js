  var formdata_store = require('../../../../models/formdata_store.js'),
  _ = require('lodash'),
  upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.findIndex(arr, key);
        arr.splice(index, 1, newval);
    } else if (arr) {
        arr.push(newval);
    }
};

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
  data: function() {
    return {
      focus: false,
      url: this.$root.path("contacts:list"),
      formdata: {}
    }
  },
  created: function() {
    this.$dispatch("details:created");
  },
  template: require('./template.jade')(),
  methods: {
    deleteFormdata: function(e) {
      e.preventDefault();
      var remove = function (arr, key) {
        var match = _.find(arr, key);
        if (match) {
          var index = _.findIndex(arr, key);
          arr.splice(index, 1);
        }
      };
      formdata_store.delete(this.$root, this.contact.id, this.formdata.id, () => {
        remove(this.contact.formdatas, {id: this.formdata.id});
        this.$root.$emit("contacts:hideFormdata", this.id);
        this.$root.navigate('contacts:showFormdatas', undefined, this.id);
      });
    },
    showFormdata: function(e, formdata) {
      e.preventDefault();
      this.$root.navigate('contacts:showFormdata', e, this.id, formdata.id);
    },
    updateFormdata: function(e) {
      e.preventDefault();
      formdata_store.update(this.$root, this.contact.id,  this.formdata, (res) => {
        upsert(this.contact.formdatas, {id: this.formdata.id}, this.formdata);
      });
    },
    prevFunc: function(e) {
      e.preventDefault();
      this.$dispatch("contacts:hideFormdata", this.id);
      this.$root.navigate('contacts:showFormdatas', undefined, this.id);
    }
  },
  events: {
    'contacts:showFormdata': function(id, formdataID) {
      this.$set("focus", true);
      this.$set("formdata", _.cloneDeep(_.find(this.contact.formdatas, {id: formdataID})));
      this.$dispatch("tabs:hide");
      this.$dispatch('header:title', "Formdata");
      this.$dispatch('header:hideAdd');
      this.id = id;
    },
    'contacts:hideFormdata': function(id) {
      this.$set("focus", false);
      this.$dispatch("tabs:show");
      this.$dispatch('tabs:nb', this.contact.notes ? this.contact.notes.length : 0,this.contact.formdatas ? this.contact.formdatas.length : 0, this.contact.tags ? this.contact.tags.length : 0);
      this.$dispatch('header:title', `${this.contact.firstname} ${this.contact.surname}`);
    }
  }
};
