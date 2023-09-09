const { json } = require("body-parser");
const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./api/routes/userRoutes");
const globalErrorHandler = require("./utils/appError");
const AppError = require("./utils/appError");
const eventRouter = require('./api/routes/eventRoutes');

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("HELLO WORLD")
});

app.use("/api/v1/users", userRouter);
app.use('/api/v1/events',eventRouter)

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use((err, req, res, next) => {
  res.status(500).json({
    error: {
      message: err.message || "Something went wrong",
    },
  });
});


module.exports = app;
