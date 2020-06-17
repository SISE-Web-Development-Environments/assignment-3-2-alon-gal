const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("client-sessions");

//#region global imports
require("dotenv").config();

//#endregion
//#region express configures

const asyncHandler = require("express-async-handler");
var path = require("path");
var logger = require("morgan");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

const users = require("./routes/users");
const recipes = require("./routes/recipes");
const auth = require("./routes/auth");

const port = process.env.PORT || 4000;
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));
app.use(
    session({
        cookieName: "session",
        secret: "abc123",
        duration: 60 * 1000 * 15,
        activeDuration: 0,
        id: null,
    })
);

app.use(auth);
app.use("/users",users);
app.use("/recipes",recipes);
app.use((req,res) => res.sendStatus(404));


app.listen(port, () => {
    console.log('Example app listening on port ' + port');
});
