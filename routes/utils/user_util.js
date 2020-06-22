var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
//#region express configures
var DButils = require("../../DButils");

async function checkIdOnDb(id) {
  const users = await DButils.execQuery(
    "SELECT userName, password FROM dbo.users"
  );
  return users.find((x) => x.userName === id);
}

async function getFavoriteIds(userName) {
  let favoriteRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName, recipe_id FROM dbo.Users_Favorites"
  );
  users.forEach((element) => {
    if (element.userName == userName) favoriteRecipes.push(element.recipe_id);
  });
  return favoriteRecipes;
}

async function addToFavorites(userName, recipeID) {
  await DButils.execQuery(
    `INSERT INTO dbo.Users_Favorites VALUES (N'${userName}' ,${recipeID})`
  );
}

async function addToLastThreeWatched(userName, recipeID) {
  let users = [];
  const users_watched = await DButils.execQuery(
    "SELECT userName, recipe_id, seq FROM dbo.Users_ThreeLastWatched"
  );
  users_watched.forEach((element) => {
    if (element.userName == userName)
      if (element.recipe_id == recipeID) {
        throw "already exist";
      } else {
        users.push(element);
      }
  });
  let max = Math.max.apply(
    Math,
    users.map(function (o) {
      return o.seq;
    })
  );
  if (max < 0) {
    max = 0;
  }
  if (max < 3) {
    await DButils.execQuery(
      `INSERT INTO dbo.Users_ThreeLastWatched VALUES (N'${userName}' ,${recipeID} ,${
        max + 1
      })`
    );
  } else {
    await DButils.execQuery(
      `DELETE FROM dbo.Users_ThreeLastWatched WHERE userName=N'${userName}' AND seq=1`
    );
    await DButils.execQuery(
      `UPDATE dbo.Users_ThreeLastWatched  SET seq=seq-1 WHERE userName=N'${userName}'`
    );
    await DButils.execQuery(
      `INSERT INTO dbo.Users_ThreeLastWatched VALUES (N'${userName}' ,${recipeID} ,3)`
    );
  }
}

async function addToWatched(userName, recipeID) {
  await DButils.execQuery(
    `INSERT INTO dbo.Users_Watched VALUES (N'${userName}' ,${recipeID})`
  );
}

async function getMyRecipes(userName) {
  let myRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName,id,image,title,readyInMinutes,vegetarian,vegan,glutenFree,aggregateLikes,instructions,Ingredients,servings FROM dbo.Users_MyRecipes"
  );
  users.forEach((element) => {
    if (element.userName == userName) myRecipes.push(element);
  });
  return myRecipes;
}

async function getRecipe(id) {
  let myRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName,id,image,title,readyInMinutes,vegetarian,vegan,glutenFree,aggregateLikes,instructions,Ingredients,servings FROM dbo.Users_MyRecipes"
  );
  users.forEach((element) => {
    if (element.id == id) myRecipes.push(element);
  });
  return myRecipes;
}


async function getMyFamilyRecipes(userName) {
  let myRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName, recipe_id, recipe_name, recipes_owner, whenMade, ingredients, instructions, photoUrl FROM dbo.Users_FamilyRecipes"
  );
  users.forEach((element) => {
    if (element.userName == userName) myRecipes.push(element);
  });
  return myRecipes;
}

async function getLastWatchedRecipes(userName) {
  let myRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName, recipe_id FROM dbo.Users_ThreeLastWatched"
  );
  users.forEach((element) => {
    if (element.userName == userName) myRecipes.push(element.recipe_id);
  });
  return myRecipes;
}

async function getWatchedRecipes(userName) {
  let myRecipes = [];
  const users = await DButils.execQuery(
    "SELECT userName, recipe_id FROM dbo.Users_Watched"
  );
  users.forEach((element) => {
    if (element.userName == userName) myRecipes.push(element.recipe_id);
  });
  return myRecipes;
}

function extractQureryParams(query_params, params) {
  const params_list = ["diet", "cuisine", "intolerence"];
  params_list.forEach((param) => {
    if (query_params[param]) {
      params[param] = query_params[param];
    }
  });
}

exports.checkIdOnDb = checkIdOnDb;
exports.getFavoriteIds = getFavoriteIds;
exports.addToFavorites = addToFavorites;
exports.addToLastThreeWatched = addToLastThreeWatched;
exports.getMyRecipes = getMyRecipes;
exports.getMyFamilyRecipes = getMyFamilyRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
exports.getWatchedRecipes = getWatchedRecipes;
exports.addToWatched = addToWatched;
exports.extractQureryParams = extractQureryParams;
exports.getRecipe = getRecipe;
