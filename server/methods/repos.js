Meteor.methods({
  'Repos.insert': function (params) {
    Repos.insert(params);
  },
  /**
   * Update repos cron Job.
   * @param query
   */
  updateRepos: function (query) {
    var docs = [];
    var CollectionRepos = Repos.find().fetch();

    var plucked = _.pluck(CollectionRepos, 'title'),
      auth = Meteor.settings.default_api_account.account.user + ':' + Meteor.settings.default_api_account.account.pass;

    //console.log(plucked);
    //console.log(Meteor.settings);
    try {
      var response = HTTP.get('https://api.github.com/users/' + Meteor.settings.default_api_account.account.user + '/repos', //+ query +
        {
          headers: {'user-agent': 'node.js'},
          auth: auth
        }
      );

      _.each(response.data, function (item) {
        //console.log(item.name + ' repository fetched' + item.pushed_at);
        var doc = {
          owner: item.owner,
          thumb: item.owner.avatar_url,
          title: item.name,
          link: item.html_url,
          desc: item.description,
          pushed_at: item.pushed_at
        };
        var checkStop = Repos.findOne({title: item.name});
        if (!checkStop) {
          Repos.insert(doc, function (error) {
            if (error) {
              console.log(error);
            }
          });
        } else {
          Repos.update(checkStop._id, doc, function (error) {
            if (error) {
              console.log(error);
            }
          });
        }

        docs.push(doc);
      }, this);

      // Remove from Collection if not exist in service.Sync.
      var pluckedDocs = _.pluck(docs, 'title');
      _.each(plucked, function (title) {
        if (!exists(pluckedDocs, title)) {
          var toRemove = Repos.findOne({title: title});
          Repos.remove(toRemove._id, function (error) {
            if (error) {
              console.log(error);
            }
            console.log(toRemove.title + 'removed');
          });
        }
      });

    } catch (error) {
      console.log(error);
    }
    /**
     *
     * @param array
     * @param title
     * @returns {boolean}
     */
    function exists(array, title) {
      return !!_.findWhere(array, title);
    }
  }
});
