const { json } = require("body-parser");
const express = require("express");
const app = express();
const morgan = require("morgan");
const userRouter = require("./api/routes/userRoutes");
const globalErrorHandler = require("./utils/appError");
const AppError = require("./utils/appError");

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);


module.exports = app;
