module.exports = {
  template: require('./template.jade')(),
  props: {
    contact: {
      type: Object,
      required: true
    }
  }
};
