var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
//#region express configures
var logger = require("morgan");
const user_util = require("./utils/user_util");
const search_util = require("./utils/search_util");

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
    else{
      res.status(401).send({
        message: "not logged in",
        success: false,
      });
    }
  }else{
    res.status(401).send({
      message: "not logged in",
      success: false,
    });
  }
});

router.get("/favorites/:userName", async (req, res) => {
  const username = req.params.userName;
  let favoriteRecipes = await user_util.getFavoriteIds(username);
  let id_list = favoriteRecipes;
  search_util
    .getRecipesByid(id_list)
    .then((ans) => res.send(ans))
    .catch((error) => {
      res.sendStatus(500);
    });
});

router.post("/favorites", async (req, res) => {
  //Alon
  try {
    const username = req.user.userName;
    const recipe_id = req.body.recipe_id;
    await user_util.addToFavorites(username, recipe_id);
    res.status(201).send({
      message: "recipe added successfully to the favorite list",
      success: true,
    });
  } catch (err) {
    res.status(401).send({
      message: "recipe is already added",
      success: false,
    });
  }
});

router.get("/favoritesId/:userName", async (req, res) => {
  //Alon
  const username = req.params.userName;
  let favoriteRecipes = await user_util.getFavoriteIds(username);
  res.status(201).send({ favoriteRecipes });
});

router.post("/watched", async (req, res) => {
  //Alon
  try {
    const username = req.user.userName;
    const recipe_id = req.body.recipe_id;
    await user_util.addToWatched(username, recipe_id);
    res.status(201).send({
      message: "recipe added successfully to the watched list",
      success: true,
    });
  } catch (err) {
    res.status(201).send({
      message: "recipe is already added",
      success: true,
    });
  }
});

router.get("/getMyRecipes/:recipe_id", async (req, res) => {
  //Alon
  const recipe_id = req.params.recipe_id;
  let myRecipes = await user_util.getMyRecipes(recipe_id);
  res.status(201).send({ myRecipes });
});

router.get("/family/:userName", async (req, res) => {
  //Alon
  const username = req.params.userName;
  let myRecipes = await user_util.getMyFamilyRecipes(username);
  res.status(201).send({ myRecipes });
});

router.get("/watched/:userName", async (req, res) => {
  //Alon
  const username = req.params.userName;
  let myRecipes = await user_util.getWatchedRecipes(username);
  res.status(201).send({ myRecipes });
});

router.get("/lastThreeWatched/:userName", async (req, res) => {
  const username = req.params.userName;
  let myRecipes = await user_util.getLastWatchedRecipes(username);
  search_util
    .getRecipesByid(myRecipes)
    .then((ans) => res.send(ans))
    .catch((error) => {
      res.sendStatus(500);
    });
});

router.post("/lastThreeWatched", async (req, res) => {
  //Alon
  try {
    const username = req.user.userName;
    const recipe_id = req.body.recipe_id;
    await user_util.addToLastThreeWatched(username, recipe_id);
    res.status(201).send({
      message: "recipe added successfully to the last three watched list",
      success: true,
    });
  } catch (err) {
    res.status(201).send({
      message: "recipe is already added",
      success: true,
    });
  }
});

router.use((req,res) => res.sendStatus(404));

module.exports = router;
