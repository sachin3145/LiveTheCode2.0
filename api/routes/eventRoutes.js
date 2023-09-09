const express = require('express');
const app = express();
const router = express.Router();
const eventController = require('../controllers/eventController')
const authController = require('../controllers/authController');


router
.route('/')
.post(eventController.addNewEvent);

router.route("/getEvents").post(eventController.getAllEvents);

router
.route('/:id')
.get(eventController.getParticularEvent)
.patch(eventController.updateEvent)
.delete(eventController.deleteEvent);

module.exports = router;