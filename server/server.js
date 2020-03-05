//Bring in .env Variables
require("dotenv").config();
//Set up Express App
const express = require("express");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

// Middlewares

app.use(cookieParser());
app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.use(morgan("dev"));

// Passport Config
app.use(passport.initialize());
require("./config/passport")(passport);

//Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));

//Create a connection with express
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`APP Running on Port ${port}`));
