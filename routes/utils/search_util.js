const axios = require("axios");
require("dotenv").config();
const api_key = process.env.spooncular_apiKey;

async function getRecipeByid(id){

    let recipe = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`,{
    params:{
            apiKey:api_key
        }
    });
    let recipeData = extractRelevantRecipeData(recipe.data);
    return recipeData;
}

async function getRecipesByid(id_list){
    let promises = [];

    id_list.map((id) => promises.push(axios.get(`https://api.spoonacular.com/recipes/${id}/information`,{
        params:{
                apiKey:api_key
            }
        }))
  );


    let recipes = await Promise.all(promises);
    console.log(recipes);
    let recipesData= extractRelevantRecipesData(recipes);
    return recipesData;
}

async function getRandomRecipes(howMany){
    let res = [];
  for (let i = 0; i < howMany; i++) {
    let ans = await axios.get(`https://api.spoonacular.com/recipes/random`, {
      params: {
        apiKey: api_key,
        number: 1,
      }
    });
    let recipes = ans.data.recipes;
    let recipesData = extractRelevantRecipesData1(recipes);
    while (recipesData[0].instructions == "") {
      ans = await axios.get(`https://api.spoonacular.com/recipes/random`, {
        params: {
          apiKey: api_key,
          number: 1,
        }
      });
      recipes = ans.data.recipes;
      recipesData = extractRelevantRecipesData1(recipes);
    }
    res.push(recipesData[0]);
  }
  return res;
}

function extractRelevantRecipeData(recipes_Info) {
    let{
        id,
        title,
        readyInMinutes,
        aggregateLikes,
        vegetarian,
        vegan,
        glutenFree,
        image,
        servings,
        instructions,
        extendedIngredients,
    } = recipes_Info;

      return{
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        vegetarian: vegetarian,
        vegan: vegan,
        glutenFree: glutenFree,
        image: image,
        servings: servings,
        instructions: instructions,
        Ingredients: extractIngredients(extendedIngredients),
      }

  }

  function extractRelevantRecipesData(recipes_Info) {
    return recipes_Info.map((recipe_info) => {
      const {
        id,
        title,
        readyInMinutes,
        aggregateLikes,
        vegetarian,
        vegan,
        glutenFree,
        image,
        servings,
        instructions,
        extendedIngredients,
      } = recipe_info.data;
  
      return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        vegetarian: vegetarian,
        vegan: vegan,
        glutenFree: glutenFree,
        image: image,
        servings: servings,
        instructions: instructions,
        Ingredients: extractIngredients(extendedIngredients),
      };
    });
  }


  function extractRelevantRecipesData1(recipes_Info) {
    return recipes_Info.map((recipe_info) => {
      const {
        id,
        title,
        readyInMinutes,
        aggregateLikes,
        vegetarian,
        vegan,
        glutenFree,
        image,
        servings,
        instructions,
        extendedIngredients,
      } = recipe_info;
  
      return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        aggregateLikes: aggregateLikes,
        vegetarian: vegetarian,
        vegan: vegan,
        glutenFree: glutenFree,
        image: image,
        servings: servings,
        instructions: instructions,
        Ingredients: extractIngredients(extendedIngredients),
      };
    });
  }

  function extractIngredients(extendedIngredients) {
    return extendedIngredients.map((extendedIngredients) => {
      const {
        id,
        name,
        amount,
        unit,
        original,
      } = extendedIngredients;
  
      return {
        id: id,
        name: name,
        amount: amount,
        unit: unit,
        original: original,
      };
    });
  } 
    

function extractQureryParams(query_params, search_params){
    const params_list = ["diet","cuisine","intolerence"];
    params_list.forEach((param) => {
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });
 }

async function searchForRecipes(search_params){
    let search_response = await axios.get(
        `https://api.spoonacular.com/recipes/search`,
        {
            params: search_params,
        }
    );
    const recipes_id_list = extractSearchResultsIds(search_response);
    let info_array = getRecipesByid(recipes_id_list);
    return info_array;
}

// async function getRecipesInfo(recipes_id_list){
//     let promises = [];
//     recipes_id_list.map((id) => 
//     promises.push(axios.get(`${api_url}/${id}/info?${api_key}`))
//     );
//     let info_response1 = await Promise.all(promises);
//     relevantRecipes = extractSearchResultsData(info_response1);
//     return relevantRecipes;
// }

function extractSearchResultsIds(search_response){
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes.map((recipe) => {
        recipes_id_list.push(recipe.id);
    });
    return recipes_id_list;
}

// function extractSearchResultsData(recipes_Info){
//     return recipes_Info.map((recipe_info) => {
//         const {
//             id
//         } = recipe_info.data;
//         return {
//             id: id
//         };
//     });
// }

exports.extractQureryParams = extractQureryParams;
exports.searchForRecipes = searchForRecipes;
exports.getRecipeByid=getRecipeByid;
exports.getRecipesByid=getRecipesByid;
exports.getRandomRecipes=getRandomRecipes;
