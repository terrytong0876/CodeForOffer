// Create an Auto-Incrementing Sequence Field: Use Counters Collection - 
//   http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/#auto-increment-counters-collection
Urls = new Mongo.Collection('Urls');

Urls.attachSchema(new SimpleSchema({
  longUrl: {
    type: String,
    // is this check is too strong?
    regEx: SimpleSchema.RegEx.Url,
  },
  createdAt: {
    type: Date
  }
}));

