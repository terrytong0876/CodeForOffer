Template.home.helpers({
  'showShortenUrl': function() {
    var message = Session.get('showShortenUrl');
    if (message) {
      return message;
    }
  },
  'showGetOriginalUrl': function() {
    var message = Session.get('showGetOriginalUrl');
    if (message) {
      return message;
    }
  }
});

Template.home.events({
  'submit .shorten-url-form': function(event) {
    var longUrl = event.target.longUrl.value;
    var shortUrl = Meteor.call('longToShort', longUrl, function(err, shortUrl) {
      if (err) {
        // TODO: better way to handle error
        console.log(err.message);
      } else {
        var message = 'Your long Url: ' + longUrl + ' is shortened to: ' + shortUrl;
        Session.set('showShortenUrl', message);
      }
    });
    return false;
  },
  'submit .get-long-url-form': function(event) {
    var shortUrl = event.target.shortUrl.value;
    console.log('input short url: ' + shortUrl);
    var id = shortUrl.replace(RegExp('^' + BASE_URL), '');
    console.log('remove base url: ' + id);
    var find = Urls.findOne({ _id: id });
    var message = find ? 'Your input short Url is: ' + shortUrl + '  It will be redirect to: ' + find.longUrl : 'Your input short url does not exist';
    Session.set('showGetOriginalUrl', message);
    return false;
  }
});
