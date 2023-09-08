const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us event name"],
  },
  theme: {
    type: String,
    required: [true, "Please tell us about event theme"],
  },
  description: {
    type: String,
    required: [false, "Please describe the event"],
  },
  schedule: {
    type: Date,
    required: [true, "Please enter schedule"],
  },
 
    location:{
    type: [Number],
}
,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;