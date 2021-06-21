// offre_rides-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'offreRides';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    destination: { type: String, required: true },
    destinationLat: { type: Number, required: true },
    destinationLog: { type: Number, required: true },
    price: Number,
    time: String,
    currentAdresse : String,
    currentAdresseLat : Number,
    currentAdresselog : Number,
    places: Number,
    date: Date,
    isFull : {type : Boolean, default : false},
    user: { ref: 'users', type: Schema.Types.ObjectId },
    rideUser: [{ ref: 'users', type: Schema.Types.ObjectId , default : []}],
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
