module.exports = {
  data: function() {
    return {
      newFormdata: this.baseFormdata(),
      url: this.$root.path("contacts:showFormdatas", this.$parent.contact_id)
    }
  },
  template: require('./template.jade')(),
  methods: {
    createFormdata: function(formdata, e) {
      e.preventDefault();
      //formdata.author = this.$root.me.firstname + " " + this.$root.me.surname;
      this.$parent.addFormdata(formdata);
      this.newFormdata = this.baseFormdata();
    },
    back: function(e) {
      e.preventDefault();
      this.$root.navigate("contacts:showFormdatas", undefined, this.$parent.contact_id);
    },
    baseFormdata: function() {
      return {
        date: null,
        data: null,
        id: null 
      }
    }
  }
};
