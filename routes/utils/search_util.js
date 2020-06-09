const axios = require("axios");
const api_key = "af41647aa0114f679992608f6467f6f1";

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
  let ans = await axios.get(`https://api.spoonacular.com/recipes/random`,{
    params:{
            apiKey:api_key,
            number:howMany,
        }
    });
    let recipes = ans.data.recipes;
    let recipesData= extractRelevantRecipesData1(recipes);
    return recipesData;
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
        name,
        amount,
        unit,
      } = extendedIngredients;
  
      return {
        name: name,
        amount: amount,
        unit: unit,
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
