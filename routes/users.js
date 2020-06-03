var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
const axios = require("axios");
//#region express configures
var logger = require("morgan");
const user_util = require("./utils/user_util");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.use(async (req, res, next) => {
  if (req.session && req.session.id) {
    const id = req.session.id;
    const user = await user_util.checkIdOnDb(id);

    if (user) {
      req.user = user;
      next();
    }
  }
  res.status(401);
});

router.get("/getMyFavorite", async (req, res) => {
  //Alon - Get (Maybe to get from added recipes)
  const username = req.user.userName;
  let favoriteRecipes = await user_util.getFavoriteIds(username);
  res.status(201).send({ favoriteRecipes });

  //Gal - Get from API
});

router.post("/addRecipeToFavorites", async (req, res) => {
  //Alon
  const username = req.user.userName;
  const recipe_id = req.body.recipe_id;
  await user_util.addToFavorites(username, recipe_id);
  res
    .status(201)
    .send({
      message: "recipe added successfully to the favorite list",
      success: true,
    });
});

router.post("/addRecipeToWatched", async (req, res) => {
  //Alon
  try{
  const username = req.user.userName;
  const recipe_id = req.body.recipe_id;
  await user_util.addToWatched(username, recipe_id);
  res
    .status(201)
    .send({
      message: "recipe added successfully to the watched list",
      success: true,
    });
  }catch(err){
    res
    .status(409)
    .send({
      message: err,
      success: false,
    });
  }
});

router.get("/getMyRecipes", async (req, res) => {
  //Alon
  const username = req.user.userName;
  let myRecipes = await user_util.getMyRecipes(username);
  res.status(201).send({ myRecipes });
});

router.get("/getMyFamilyRecipes", async (req, res) => {
  //Alon
  const username = req.user.userName;
  let myRecipes = await user_util.getMyFamilyRecipes(username);
  res.status(201).send({ myRecipes });
});

router.post("/addRecipe", (req, res) => {
  //not needed
});

router.post("/addRecipeToFamilyRecipes", (req, res) => {
    //not needed
});

router.get("/getLastWatchedRecipes", async (req, res) => {
  const username = req.user.userName;
  let myRecipes = await user_util.getLastWatchedRecipes(username);
  res.status(201).send({ myRecipes });
});

module.exports = router;
