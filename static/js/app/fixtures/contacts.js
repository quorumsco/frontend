var casual = require('chance');

var contact_gen = function(id) {
  return {
    id: id,
    firstname: chance.first(),
    surname: chance.last(),
    email: chance.email()
  };
};

var array_of = function(times, generator) {
  var result = [];

  for (var i = 0; i < times; i++) {
    var contact = generator(i);
    result.push(contact);
  }

  return result;
};

module.exports = function (id) {
  if (id) {
    return contact_gen(id);
  } else {
    return array_of(25, contact_gen);
  }
};
