module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const counters = new Schema({
    name: String,
    group: { type: String, default: '' },
    sequence: Number
  });

  counters.statics.getNext = function(name, group = '') {
    return this.findOneAndUpdate(
      { name, group },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );
  };

  return mongooseClient.model('counters', counters);
};
