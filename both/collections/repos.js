Repos = new Mongo.Collection('repos');

Repos.helpers({

});

Repos.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});
