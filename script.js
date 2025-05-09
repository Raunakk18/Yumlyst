const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetails = document.querySelector(".recipe-details");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const closeBtn = document.querySelector(".recipe-close-btn");
const stars = document.querySelectorAll(".rating");
const ratingMessage = document.getElementById("rating-message");


const fetchRecipes = async(query)=>{
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>"; 
    try{
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = ""; 
    response.meals.forEach((meal) => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            
        `;

        const button = document.createElement("button");
        button.innerText = "View Recipe";
        recipeDiv.appendChild(button);

        button.addEventListener("click", () => {
            openRecipePopup(meal);
        })

        recipeContainer.appendChild(recipeDiv);
    });
}catch(error){
    recipeContainer.innerHTML = "<h2>Error in Fetching Recipes...</h2>";
}
}

const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} - ${ingredient}</li>`;
        }
        else{
            break;
        }
    }
    return ingredientsList;
}
const openRecipePopup = (meal) =>{
    recipeDetailsContent.innerHTML = `
        <h2 class ="recipeName">${meal.strMeal}</h2>
        <button id="bookmarkBtn"><i class="fa-solid fa-bookmark"></i> Bookmark</button>
        <h3>Ingredients</h3>
        <ul class= "ingredientList">${fetchIngredients(meal)}</ul>
        <div class= "recipeInstructions">
            <h3>Instructions</h3>
            <p >${meal.strInstructions}</p>
        </div>
       
        `;
    const bookmarkBtn = document.getElementById("bookmarkBtn");
    bookmarkBtn.addEventListener("click", () => {
        saveBookmark(meal);
    })

    recipeDetailsContent.parentElement.style.display = "block";

    const stars = document.querySelectorAll(".rating .star");
    const rattingMessage = document.getElementById("rating-message");

    stars.forEach( (star) =>{
        star.addEventListener("click", () =>{
            const rating = star.getAttribute("data-value");

            stars.forEach((s) => s.classList.remove("active"));
            for( let i=0; i<rating; i++){
                stars[i].classList.add("active");
            }
            ratingMessage.innerText = `You rated this recipe ${rating} out of 5`;
        })
    })
}

function saveBookmark(meal){
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];


    if (!bookmarks.find(item => item.idMeal === meal.idMeal)) {
        bookmarks.push({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb
        });
        localStorage.setItem("bookmarkedRecipes", JSON.stringify(bookmarks));
        alert("Recipe bookmarked!");
      } else {
        alert("Recipe already bookmarked!");
      }
    }

closeBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
})


function showBookmarkedRecipes() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedRecipes")) || [];
    const container = document.getElementById("bookmarksContainer");
    container.innerHTML = "";
  
    if (bookmarks.length === 0) {
      container.innerHTML = "<p>No bookmarked recipes.</p>";
      return;
    }
  
    bookmarks.forEach(meal => {
      const card = document.createElement("div");
      card.className = "bookmark-card";
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h4>${meal.strMeal}</h4>
      `;
      container.appendChild(card);
    });
  }
  


searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchValue = searchBox.value.trim();
    if (!searchValue) {
        recipeContainer.innerHTML = "<h2>Type the meal in the search box</h2>";
        return;
    }
    fetchRecipes(searchValue);
});
