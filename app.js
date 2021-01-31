const express = require("express");
const path = require("path");
const logger = require("morgan");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//connecting to db
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 5000;
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/AppError");
const UserRouter = require("./routes/userRoutes");
const AuthRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const security = require("./utils/security");
const socketIo = require("socket.io");

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
const socket = socketIo(server, {
  cors: {
    origin: "*",
  },
});

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/client/build")));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(express.static("client/build"));

//crc requests from twitter handler
app.get("/webhook/twitter", function (request, response) {
  var crc_token = request.query.crc_token;
  console.log("-----------------", crc_token);
  if (crc_token) {
    var hash = security.get_challenge_response(
      crc_token,
      process.env.API_KEY_SECRET
    );

    response.status(200);
    response.send({
      response_token: "sha256=" + hash,
    });
  } else {
    response.status(400);
    response.send("Error: crc_token missing from request.");
  }
});

//post requests for tweets
app.post("/webhook/twitter", async function (request, response) {
  const newTweetUserId = request.body.tweet_create_events[0].id;
  socket.emit("tweet", request.body);
  response.send("200 OK");
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
