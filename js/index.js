document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "https://flavor-fiesta-server-two.vercel.app/recipes"; 
    const recipesContainer = document.getElementById("recipes-container");
    const recipeModal = document.getElementById("recipe-modal");
    const modalContent = document.getElementById("modal-content");

    // Fetch and display recipes
    fetch(baseURL)
        .then(response => response.json())
        .then(data => displayRecipes(data))
        .catch(error => console.error("Error fetching recipes:", error));

    function displayRecipes(recipes) {
        recipesContainer.innerHTML = "";
        recipes.forEach(recipe => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    }

    // View Recipe button
    recipesContainer.addEventListener("click", event => {
        if (event.target.classList.contains("view-recipe")) {
            const recipeId = event.target.getAttribute("data-id");

            fetch(`${baseURL}/${recipeId}`)  
            .then(response => response.json())
            .then(recipe => showRecipeDetails(recipe))
            .catch(error => console.error("Error fetching recipe details:", error));
        
        }
    });

    function showRecipeDetails(recipe) {
        modalContent.innerHTML = `
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}" style="width:100%; border-radius:10px;">
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
            <h3>Instructions:</h3>
            <p>${recipe.instructions}</p>
        `;
        recipeModal.style.display = "flex";
    }
    
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            recipeModal.style.display = "none";
        }
    });
    
});
