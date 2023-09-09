const { Double, Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us event name"],
  },
  theme: {
    type: String,
    enum: ["Food Donation", "Blood Donation", "Clothes Donation", "Awareness Camp"],
    required: [true, "Please tell us about event theme"],
  },
  description: {
    type: String,
    default: "",
    required: [false, "Please describe the event"],
  },
  schedule: {
    type: Date,
    required: [true, "Please enter schedule"],
  },
  location: {
    type: [Decimal128],
    required: [true, "Please enter [longitude, latitude]"],
  },
  owner: {
    type: String,
    required: [true, "Please enter email"],
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;