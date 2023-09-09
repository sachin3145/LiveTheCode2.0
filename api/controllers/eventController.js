const Event = require("../models/eventModel");
const { Query } = require("mongoose");
const { isDistanceWithinRange } = require("../../utils/apiFeatures");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  console.log(req.body);
  if (req.body.location && req.body.distance) {
    let filteredEvents = [];
    Object.values(events).forEach((e) => {
      if (
        isDistanceWithinRange(e.location, req.body.location, req.body.distance)
      ) {
        const time = req.body.time;
        const current = new Date();
        if (time == "On Going") {
          if (e.startDate <= current && current <= e.endDate) {
            filteredEvents.push(e);
          }
        } else if (time == "Upcoming") {
          if (e.startDate > current) {
            filteredEvents.push(e);
          }
        } else if (time == "Past") {
          if (e.endDate < current) {
            filteredEvents.push(e);
          }
        } else {
          filteredEvents.push(e);
        }
      }
    });
    //SEND FILTERED RESPONSE
    res.status(200).json({
      status: "success",
      results: filteredEvents.length,
      data: {
        filteredEvents,
      },
    });
  } else {
    console.log("no filter");
    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: events.length,
      data: {
        events,
      },
    });
  }
});

exports.getParticularEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      event,
    },
  });
});

exports.addNewEvent = catchAsync(async (req, res, next) => {
  // IN post method req contains some data that need to be sent but express doesnt itself have property to hold that requested data or to put that body dataon the request, therefore we require some Middleware
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  console.log(req.body.startDate);
  console.log(startDate);
  const newEvent = await Event.create({
    name: req.body.name,
    theme: req.body.theme,
    description: req.body.description,
    startDate,
    endDate,
    location: req.body.location,
    owner: req.body.owner,
  });

  res.status(201).json({
    status: "Success",
    data: {
      event: newEvent,
    },
  });
});

exports.updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //to return the newly updated document
    runValidators: true, //to run again the validators that we defined in the schema
  });

  if (!event) return next(new AppError("No EVent found with that id"));

  res.status(200).json({
    status: "Success",
    message: "Updated successfully",
    data: {
      event,
    },
  });
});

exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) {
    return next(new AppError("No Event found with that id", 404));
  }
  res.status(204).json({
    status: "Success",
    data: null,
  });
});
