const config = require("./utils/config");
const express = require("express");
require('express-async-errors');

const cors = require("cors"); //handle requests from different origins (PORTs)
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger"); //print to console
const mongoose = require("mongoose");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

//////////////////////////////////////////////////////////////////////////////  
///USING IMPORTED MODULES  

app.use(cors());
//Express built-in modules
app.use(express.static("build"));//serve the static frontend files
app.use(express.json());//parsing body
app.use(middleware.requestLogger);

//Routers
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);  

module.exports = app;
