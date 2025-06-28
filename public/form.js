// Form submission and previewdocument.addEventListener("DOMContentLoaded", () => {
console.log("Recipe form initialized successfully!");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
console.log("sssssaaaaaaa" + id);

const form = document.getElementById("recipeForm");
if (!form) {
  console.error("recipeForm not found");
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("recipeTitle").value;
  let instructions = document.querySelector("#instructionsList textarea").value;

  ingredients = Array.from(
    document.querySelectorAll("#ingredientsList input")
  ).map((input) => input.value);

  const readyln = document.querySelector("#readylnList input").value;

  // Update preview
  document.getElementById("previewTitle").textContent = title;

  // Display ingredients
  const previewIngredients = document.getElementById("previewIngredients");
  previewIngredients.innerHTML = "";
  ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    previewIngredients.appendChild(li);
  });

  // Display instructions
  const previewInstructions = document.getElementById("previewInstructions");
  previewInstructions.innerHTML = "";
  if (instructions.trim()) {
    const li = document.createElement("li");
    li.textContent = instructions;
    previewInstructions.appendChild(li);
  }

  // Display ready time
  document.getElementById("previewReadyln").textContent = readyln
    ? `${readyln} minutes`
    : "Not specified";

  // Show preview
  document.getElementById("recipePreview").style.display = "block";
  document
    .getElementById("recipePreview")
    .scrollIntoView({ behavior: "smooth" });

  // Create recipe object
  const recipe = {
    title: title,
    ingredients: ingredients,
    instructions: instructions,
    readyln: readyln,

    // createdAt: new Date().toISOString(),
  };
  console.log("88888888888888888888888888888");

  try {
    const response = await fetch(`/api/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    if (response.ok) {
      const result = await response.json();
      console.log("Recipe updated:", result);
    } else {
      const errorText = await response.text();
      console.error("Server error:", errorText);
    }
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssss");
  } catch (error) {
    console.error("Failed to update recipe:", error);
  }

  console.log("Recipe created:", recipe);
  alert(
    "Recipe created successfully! Check the preview below and console for the recipe data."
  );
});

// Real-time validation
document.getElementById("recipeTitle").addEventListener("input", function () {
  if (this.value.length > 100) {
    this.style.borderColor = "#ee5a24";
  } else {
    this.style.borderColor = "#e1e8ed";
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("Recipe form initialized successfully!");
});
