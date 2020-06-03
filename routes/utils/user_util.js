const axios = require("axios");
const api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=df9dc266c11742979831b268d9def88b";
var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
//#region express configures
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var DButils = require("../../DButils");


async function checkIdOnDb(id) {
    const users = await DButils.execQuery("SELECT userName, password FROM dbo.users");
    return users.find((x) => x.userName === id);
}

async function getFavoriteIds(userName) {
    let favoriteRecipes = [];
    const users = await DButils.execQuery("SELECT userName, recipe_id FROM dbo.Users_Favorites");
    users.forEach(element => {
        if(element.userName == userName)
            favoriteRecipes.push(element.recipe_id);
    });
    return favoriteRecipes;
}

async function addToFavorites(userName, recipeID) {
    await DButils.execQuery(`INSERT INTO dbo.Users_Favorites VALUES (N'${userName}' ,${recipeID})`);
}

async function addToWatched(userName, recipeID) {
    let users = [];
    const users_watched = await DButils.execQuery("SELECT userName, recipe_id, seq FROM dbo.Users_Watched");
    users_watched.forEach(element => {
        if(element.userName == userName)
            if(element.recipe_id == recipeID){
                throw "already exist";
        }
        users.push(element);
    });
    let max = Math.max.apply(Math, users.map(function(o) { return o.seq; }))
    if(max < 0){
        max = 0;
    }
    if(max < 3){
        await DButils.execQuery(`INSERT INTO dbo.Users_Watched VALUES (N'${userName}' ,${recipeID} ,${max+1})`);
    }
    else{
        await DButils.execQuery(`DELETE FROM dbo.Users_Watched WHERE userName=N'${userName}' AND seq=1`);
        await DButils.execQuery(`UPDATE dbo.Users_Watched  SET seq=seq-1 WHERE userName=N'${userName}'`);
        await DButils.execQuery(`INSERT INTO dbo.Users_Watched VALUES (N'${userName}' ,${recipeID} ,3)`);
    }
}

async function getMyRecipes(userName) {
    let myRecipes = [];
    const users = await DButils.execQuery("SELECT userName, recipe_id FROM dbo.Users_Recipes");
    users.forEach(element => {
        if(element.userName == userName)
        myRecipes.push(element.recipe_id);
    });
    return myRecipes;
}

async function getMyFamilyRecipes(userName){
    let myRecipes = [];
    const users = await DButils.execQuery("SELECT userName, recipe_id FROM dbo.Users_Recipes");
    users.forEach(element => {
        if(element.userName == userName)
        myRecipes.push(element.recipe_id);
    });
    return myRecipes;
}

async function getLastWatchedRecipes(userName){
    let myRecipes = [];
    const users = await DButils.execQuery("SELECT userName, recipe_id FROM dbo.Users_Watched");
    users.forEach(element => {
        if(element.userName == userName)
        myRecipes.push(element.recipe_id);
    });
    return myRecipes;
}




exports.checkIdOnDb = checkIdOnDb;
exports.getFavoriteIds = getFavoriteIds;
exports.addToFavorites = addToFavorites;
exports.addToWatched = addToWatched;
exports.getMyRecipes = getMyRecipes;
exports.getMyFamilyRecipes = getMyFamilyRecipes;
exports.getLastWatchedRecipes = getLastWatchedRecipes;