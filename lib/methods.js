BASE_URL = 'http://localhost:3000/';
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
    var shortUrl = encodeFeistelCipher(curSeq);
    var userId = Meteor.userId();
    if (!userId) {
      // TODO: get client address correctly
      userId = 'guest_user_'/* + this.connection.clientAddress*/;
    }

    Urls.insert({
      _id: shortUrl,
      longUrl: longUrl,
      createdAt: new Date(),
      createdBy: userId
    }, function(err, result) {
      if (err) {
        FlashMessages.sendError('insert to Urls failed: ' + err.message);
      } else {
        Counters.update({ _id: 'main' }, {$inc: { seq: 1 }});
      }
    });

    return BASE_URL + shortUrl;
  },  // 'longToShort'
});

// Feistel cipher with 32 bits blocks, 3 rounds and a round function that is inspired by pseudo-random generators
// Reference:
//  http://stackoverflow.com/questions/10299901/how-do-sites-like-goo-gl-or-jsfiddle-generate-their-url-codes
//  http://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
//  https://wiki.postgresql.org/wiki/Pseudo_encrypt
//  http://www.postgresql.org/message-id/448163db-cac5-4e99-8c4c-57cbc6f6af78@mm
//
//  TODO: what's the pros and cons to make it be able to decode?
var encodeFeistelCipher = function(id, k1, k2, k3) {
  // base62[a-zA-Z0-9] - {0(zero), O(uppercase 'o'), I(uppercase 'i'), l(lowercase 'L')}
  var BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  var LEN = BASE58_CHARS.length;
  var keys = {
    k1: k1 || 1369,
    k2: k2 || 150889,
    k3: k3 || 714025
  };

  id = (id >>> 0);

  var roundFunction = function(_num) {
    // must be a function in the mathematical sense (x=y implies f(x)=f(y))
    // but it doesn't have to be reversible.
    // must return a value between 0 and 1
    return ((keys.k1 * _num + keys.k2) % keys.k3) / keys.k3;
  };

  var toBase58 = function(_num) {
    var ret = '';
    while (_num > 0) {
      ret = BASE58_CHARS.charAt(_num % LEN) + ret;
      _num = parseInt(_num / LEN);
    }
    return ret;
  };

  var permuteId = function(_id) {
    // select 16 most significant bits
    var l1 = ((_id >>> 16) & 65535) >>> 0;
    // select 16 least significant bits
    var r1 = (_id & 65535) >>> 0;
    var l2, r2;
    for (var i = 0; i < 3; ++i) {
      l2 = r1;
      r2 = (l1 ^ (parseInt(roundFunction(r1) * 65535) >>> 0)) >>> 0;
      l1 = l2;
      r1 = r2;
    }
    return (((r1 << 16) >>> 0) + l1) >>> 0;
  };

  return toBase58(permuteId(id));
}