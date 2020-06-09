var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
var logger = require("morgan");
var DButils = require("../DButils");
const bcrypt = require("bcrypt");
const saltRounds = 10;

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.post("/register", async (req, res, next) => {
  try {
    let user_data = req.body;
    const users = await DButils.execQuery("SELECT userName FROM dbo.users");
    if (users.find((x) => x.userName === user_data.userName)) {
      res.status(409).send({ message: "Username taken" });
    } else {
      var newUser = { ...req.body };
      if (newUser.password === newUser.confirmationPassword) {
        bcrypt.hash(newUser.password, saltRounds, async function (err, hash) {
          await DButils.execQuery(
            `INSERT INTO dbo.Users VALUES (N'${newUser.userName}', N'${newUser.firstname}',N'${newUser.lastname}', N'${hash}', N'${newUser.email}',N'${newUser.photoUrl}',N'${newUser.country}')`
          );
          res.status(201).send({ message: "user created", success: true });
        });
      } else {
        res
          .status(410)
          .send({
            message: "Confirmation Password does not match the Password",
          });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    let user_data = req.body;
    const users = await DButils.execQuery(
      "SELECT userName, password FROM dbo.users"
    );
    const user = users.find((x) => x.userName === user_data.userName);
    if (user != null) {
      bcrypt.compare(user_data.password, user.password, function (err, result) {
        if (result == true) {
          if (req.session != null) req.session.id = user.userName;
          res.status(201).send({ user });
        }
        else{
            res.status(409).send("Wrong Password");
        }
      });
    } else {
      res.status(409).send("Wrong Username");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  req.session.reset();
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.send("201");
});

module.exports = router;
