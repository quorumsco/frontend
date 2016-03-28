var casual = require('chance');

var territory_full_gen = function(id) {
  return {
    id: id,
    firstname: chance.first(),
    surname: chance.last(),
    email: chance.email(),
    adress: chance.address() + ", " + chance.city(),
    phone: chance.phone({ country: 'fr' })
  };
};

var territory_gen = function(id) {
  return {
    id: id,
    firstname: chance.first(),
    surname: chance.last(),
    email: null,
    adress: null,
    phone: null,
    notes: [],
    tags: []
  };
};

var array_of = function(times, generator) {
  var result = [];

  for (var i = 0; i < times; i++) {
    var territory = generator(i+1);
    result.push(territory);
  }

  return result;
};

module.exports = function (id) {
  if (id) {
    return territory_full_gen(id);
  } else {
    return array_of(25, territory_gen);
  }
};
