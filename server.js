const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//Start express app
const app = express();

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Fetch URI
const db_uri = require("./config/keys").mongoURI;

//Connect to cloud-DB
mongoose
  .connect(
    db_uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Mongoose connected to cloud-db"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello!");
});

//Map routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = 27000;

app.listen(port, () => console.log(`Listening for comms on port ${port}...`));
