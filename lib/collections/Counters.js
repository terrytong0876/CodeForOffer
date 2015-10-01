// Create an Auto-Incrementing Sequence Field: Use Counters Collection - 
//   http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/#auto-increment-counters-collection
Counters = new Mongo.Collection('Counters');

Counters.attachSchema(new SimpleSchema({
  seq: {
    type: Number,
    label: 'Auto increment counter'
  }
}));
