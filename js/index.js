document.addEventListener("DOMContentLoaded", () => {
    const baseURL = "https://flavor-fiesta-server-two.vercel.app/recipes";
    const recipesContainer = document.getElementById("recipes-container");
    const recipeModal = document.getElementById("recipe-modal");
    const modalContent = document.getElementById("modal-content");

    // Fetch and display recipes
    function fetchRecipes() {
        fetch(baseURL)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched recipes:", data); // Debugging
                if (Array.isArray(data) && data.length > 0) {
                    displayRecipes(data);
                } else {
                    recipesContainer.innerHTML = "<p>No recipes found.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
                recipesContainer.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
            });
    }

    // Function to display recipes
    function displayRecipes(recipes) {
        recipesContainer.innerHTML = ""; // Clear container
        recipes.forEach(recipe => {
            console.log("Creating card for:", recipe.name); // Debugging

            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");
            recipeCard.innerHTML = `
                <img src="${recipe.image || 'default-image.jpg'}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <button class="view-recipe" data-id="${recipe.id}">View Recipe</button>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    }

    // Handle "View Recipe" button clicks
    recipesContainer.addEventListener("click", event => {
        if (event.target.classList.contains("view-recipe")) {
            const recipeId = event.target.getAttribute("data-id");

            fetch(`${baseURL}/${recipeId}`)
                .then(response => response.json())
                .then(recipe => showRecipeDetails(recipe))
                .catch(error => console.error("Error fetching recipe details:", error));
        }
    });

    // Function to show recipe details in modal
    function showRecipeDetails(recipe) {
        modalContent.innerHTML = `
            <button id="close-modal">&times;</button>
            <h2>${recipe.name}</h2>
            <img src="${recipe.image}" alt="${recipe.name}" style="width:100%; border-radius:10px;">
            <h3>Ingredients:</h3>
            <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}</ul>
            <h3>Instructions:</h3>
            <p>${recipe.instructions}</p>
        `;
        recipeModal.style.display = "flex";

        // Close modal when clicking close button
        document.getElementById("close-modal").addEventListener("click", () => {
            recipeModal.style.display = "none";
        });
    }

    // Close modal when clicking outside content
    recipeModal.addEventListener("click", event => {
        if (event.target === recipeModal) {
            recipeModal.style.display = "none";
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            recipeModal.style.display = "none";
        }
    });

    // Handle new recipe form submission
    document.getElementById("recipe-form").addEventListener("submit", function(event) {
        event.preventDefault();

        // Get form values
        const name = document.getElementById("recipe-name").value;
        const image = document.getElementById("recipe-image").value;
        const ingredients = document.getElementById("recipe-ingredients").value.split(",");
        const instructions = document.getElementById("recipe-instructions").value;

        // Create a new recipe object
        const newRecipe = {
            id: Date.now(), // Unique ID for temporary display
            name: name,
            image: image || "default-image.jpg",
            ingredients: ingredients,
            instructions: instructions
        };

        // Save to API
        fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecipe)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Recipe added:", data);
            fetchRecipes(); // Refresh recipe list
        })
        .catch(error => console.error("Error adding recipe:", error));

        // Clear form fields
        document.getElementById("recipe-form").reset();
    });

    // Fetch recipes on page load
    fetchRecipes();
});
