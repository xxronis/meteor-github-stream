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

    var plucked = _.pluck(CollectionRepos, 'title');


    console.log(plucked);
    try {
      var response = HTTP.get('https://api.github.com/users/' + query + '/repos',
        {
          headers: {'user-agent': 'node.js'}
          ,
          auth: "xxronis:enosis21@git"
        }
      );
      //console.log(response)

      _.each(response.data, function (item) {
        console.log(item.name + ' repository fetched');
        var doc = {
          owner: item.owner,
          thumb: item.owner.avatar_url,
          title: item.name,
          link: item.html_url,
          desc: item.description,
          pushed_at: item.pushed_at
        };
        var checkStop = Repos.findOne({title: item.name});
        //console.log('find +++' + Repos.findOne({"name": item.name}));
        if (!checkStop) {
          //Repos.insert(doc);
          Repos.insert(doc, function (error) {
            if (error) {
              console.log(error);
            }
          });
        } else {
          Repos.update(doc._id, doc, function (error) {
            console.log(doc.title + 'updated!')
            if (error) {
              console.log(error);
            }
          });
        }

        docs.push(doc);
      }, this);

      // Remove from Collection if not exist in service.Sync.
      var pluckedDocs = _.pluck(docs, 'title');
      console.log(pluckedDocs);
      _.each(plucked, function (title) {
        //console.log(title + ' plucked');
        if (!exists(pluckedDocs, title)) {
          console.log('removing ' + title);
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
