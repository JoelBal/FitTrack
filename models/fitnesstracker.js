const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FitTrackSchema = new Schema({
  exercises: [
    {
  name: {
    type: String,
    trim: true,
  },
  type: {
    type: Number,
    trim: true,
  },
  weight: {
    type: Number,
  },
  sets: {
    type: Number
  },
 duration: {
   type: Number,
 },
}
],

day: {
  type: Date,
  default: Date.now
}
});



const Workout = mongoose.model("FitTrack", FitTrackSchema);

module.exports = Workout;
