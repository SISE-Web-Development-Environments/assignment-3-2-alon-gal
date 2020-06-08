var express = require("express");
var router = express.Router();
//#region global imports
require("dotenv").config();
const axios = require("axios");
//#region express configures
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var DButils = require("../DButils")
const search_util = require("./utils/search_util");
const api_key = "af41647aa0114f679992608f6467f6f1";

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json

router.get("/searchRecipes/query/:searchQuery/:numOfResults", (req, res) => {

     const{ searchQuery, numOfResults } = req.params;
     search_params = {};
     search_params.query = searchQuery;
     search_params.number = numOfResults;
     search_params.apiKey=api_key;
     search_params.instructionsRequired = true;
     search_util.extractQureryParams(req.query,search_params);

     console.log(search_params);
    search_util.searchForRecipes(search_params)
    .then((info_array) => res.send(info_array))
    .catch((error) => {
        res.sendStatus(500);
    });
});

router.get("/getRandomRecipes/:howMany", (req, res) => {
    //Gal
    search_util.getRandomRecipes(req.params.howMany)
    .then((ans)=>res.send(ans))
    .catch((error) => {res.sendStatus(500);});
});

router.get("/getRecipe/:id", (req, res) => {
    search_util.getRecipeByid(req.params.id)
    .then((ans)=>res.send(ans))
    .catch((error) => {res.sendStatus(500);});
});



module.exports = router;