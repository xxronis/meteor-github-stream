Meteor.publishComposite('myrepos', function(query) {
  return {
    find: function() {
      return Repos.find({});
    }
    // ,
    // children: [
    //   {
    //     find: function(item) {
    //       return [];
    //     }
    //   }
    // ]
  }
});
//Meteor.publish('myrepos', function(query) {
//  return Repos.find();
//});
