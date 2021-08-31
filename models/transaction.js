const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FitTrackSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter Reps"
  },
  value: {
    type: Number,
    required: "Enter number of Reps"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Transaction = mongoose.model("Transaction", FitTrackSchema);

module.exports = Transaction;
