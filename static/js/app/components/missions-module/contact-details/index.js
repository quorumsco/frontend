module.exports = {
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  template: require('./template.jade')()
};
