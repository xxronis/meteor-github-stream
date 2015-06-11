Template.dashboard.rendered = function() {

};
Template.dashboard.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var query = template.$('input[type=text]').val();
    if (query)
      Session.set('query', query);
  }
});

Template.dashboard.helpers({
  repos: function() {
    return Repos.find({}, {sort: {pushed_at: -1}});
  },
  searching: function() {
    return Session.get('searching');
  },
  count: function() {
    return Repos.find().count();
  }
});