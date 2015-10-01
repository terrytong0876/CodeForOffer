Meteor.methods({
  'longToShort': function(longUrl) {
    if (!Counters.find({ _id: 'main' }).count()) {
      Counters.insert({
        _id: 'main',
        seq: 0
      }, function(err, result) {
        if (err) {
          FlashMessages.sendError('insert to Counters failed: ' + err.message);
        }
      });
    }

    // TODO: deal with racing clients
    var curSeq = Counters.findOne({ _id: 'main' }).seq;
    var shortUrl = curSeq;  // TODO: replace with a function generating better shortUrl string based on curSeq

    Urls.insert({
      _id: shortUrl.toString(),
      longUrl: longUrl,
      createdAt: new Date()
    }, function(err, result) {
      if (err) {
        FlashMessages.sendError('insert to Urls failed: ' + err.message);
      } else {
        Counters.update({ _id: 'main' }, {$inc: { seq: 1 }});
      }
    });

    return shortUrl;
  }  // 'longToShort'
});