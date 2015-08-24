var casual = require('chance');

var tag_gen = function(id) {
  return {
    id: id,
    name: chance.word(),
    color: chance.color({format: 'hex'})
  }
}

var note_gen = function(id) {
  return {
    id: id,
    author: chance.name(),
    date: chance.date({string: true, year: 2015, american: false}),
    content: chance.paragraph()
  }
}

var contact_gen = function(id) {
  return {
    id: id,
    firstname: chance.first(),
    surname: chance.last(),
    email: chance.email(),
    notes: array_of((Math.random() * 100) % 4 + 1, note_gen),
    tags: array_of((Math.random() * 100) % 10 + 1, tag_gen)
  };
};

var array_of = function(times, generator) {
  var result = [];

  for (var i = 0; i < times; i++) {
    var contact = generator(i+1);
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
