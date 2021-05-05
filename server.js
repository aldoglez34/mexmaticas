const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;
const morgan = require("morgan");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");

// middleware
// use morgan logger for logging requests
app.use(morgan("dev"));

// parse request body as JSON (using body-parser)
// parse application/json (using body-parser)
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// API routes
app.use(routes);

// send every other request to the React app
// define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// connect to the Mongo DB
let MONGODB_URI =
  process.env.REACT_APP_MONGODB_ATLAS_KEY || "mongodb://localhost/mathDB";

mongoose
  .connect(MONGODB_URI, {
    // autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to database was successful"))
  .catch((error) => console.log(error));

// start server
app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
