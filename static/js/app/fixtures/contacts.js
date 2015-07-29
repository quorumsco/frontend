module.exports = function (id) {
  if (id) {
    return {id: id, firstname: "Jean", surname: "Dupon"};
  } else {
    return [
      {id: 0, firstname: "Jean", surname: "Dupond"},
      {id: 0, firstname: "Jean", surname: "Dupont"}
    ];
  }
};
