//Meteor.startup(function() {
//
//  Factory.define('item', Items, {
//    name: function() { return Fake.sentence(); },
//    rating: function() { return _.random(1, 5); }
//  });
//
//  if (Items.find({}).count() === 0) {
//
//    _(10).times(function(n) {
//      Factory.create('item');
//    });
//
//  }
//
//});
// 5 is the number of intervals between invoking the job
// so this job will happen once every 5 minute
SyncedCron.add({
  name: 'Get repos',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 10 seconds');
  },
  job: function() {
    Meteor.call('updateRepos', 'xxronis');
  }
});
// Startup
Meteor.startup(function() {
  // Start jobs
  SyncedCron.start();
});