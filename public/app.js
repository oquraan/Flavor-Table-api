const CardContaier = document.getElementById("CardContaier");
// require("dotenv").config();

const randomClick = document.getElementById("randomClick");

// let listfavorite = [];
// randomClick.addEventListener("click", randomRecip);
async function randomRecip() {
  try {
    const response = await fetch(`http://localhost:3001/recipes/random`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error:", errorData.error);
      document.getElementById("msseage1").innerText = errorData.error;
      return;
    }
    const data = await response.json();
    const card = document.createElement("div");
    card.className = "card";

    const ingredientsHTML = data.extendedIngredients
      .map(
        (element, index) =>
          `<p class='houseOfCard'>${index + 1 + "." + element.name}</p>`
      )
      .join("");
    card.innerHTML = `         <img class="imgcard" src="${
      data.image ? data.image : "images/not-found.png"
    }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${data.title}</p>
            <p class="nameOfCard">${data.instructions}</p>

      Ingredients: 
      ${ingredientsHTML}
          

            
              </div>
                     <div class="cardContant">       <button class="favoretButton">Favorite</button>
   <button class="deletetButton">Delete</button> 
   
   </div>           

    `;

    addFavorite(data.title, data.image, card);
    deleteFa(data.title, card);

    CardContaier.appendChild(card);
  } catch (error) {
    console.log(error);
  }
}
randomRecip();
const addCon = document.getElementById("addCon");

// const searchButton = document.getElementById("searchButton");

const searchButton = document.getElementById("searchButton");
if (searchButton) {
  searchButton.addEventListener("click", searchButtonFun);
}
const msseage = document.getElementById("msseage");

async function searchButtonFun() {
  const ingredient = document
    .getElementsByClassName("infoInput")[0]
    .value.trim();
  let ingredients = ingredient.split(" ").join(",");
  console.log(ingredients);
  if (!ingredient) return;
  document.getElementsByClassName("infoInput")[0].value = "";
  // const params = new URLSearchParams();
  // ingredients.forEach((element) => {
  //   params.append("ingredients", element);
  // });

  addCon.innerHTML = "";
  try {
    let ingredients = ingredient.split(" ").join(",");

    if (ingredients === "" || ingredients.trim() === "") {
      msseage.innerHTML = "<p>Enter your recipess</p>";
    }
    const response = await fetch(
      `http://localhost:3001/recipes/search?ingredients=${ingredients}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      msseage.innerText = errorData.error;
      return;
    }
    const data = await response.json();

    if (data.length === 0) {
      msseage.innerHTML = "<p>No recipes found.</p>";
      return;
    } else msseage.innerHTML = "";

    // const ingredientsHTML = data.extendedIngredients
    //   .map(
    //     (element, index) =>
    //       `<p class='houseOfCard'>${index + 1 + "." + element.name}</p>`
    //   )
    // .join("");
    data.forEach((element) => {
      const card = document.createElement("div");
      card.className = "card1";
      // card.innerHTML = "";
      card.innerHTML = `         <img class="imgcard" src="${
        element.image ? element.image : "../images/mansaf.jpg"
      }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${element.title}</p>
               <p>missedIngredients :</p>    <p class="nameOfCard">${element.missedIngredients.join(
                 ","
               )}</p>
       <p>usedIngredients: </p>  <p class="nameOfCard">   ${element.usedIngredients.join(
         ","
       )}</p>
             <div class="cardContant">       <button class="favoretButton">Favorite</button>
             <button class="deletetButton">Delete FV</button>
                          <button class="addDetailes" id=${
                            element.id
                          }>Ad Details</button>

             
 </div> 

    `;
      addFavorite(element.title, element.image, card);
      deleteFa(element.title, card);

      addCon.appendChild(card);

      const detail = card.querySelector(".addDetailes");
      // detail.addEventListener("click", () => {
      //   viewDetails(element.id);
      // });

      detail.addEventListener("click", () => {
        window.location.href = `Details.html?id=${element.id}`;
      });
    });
  } catch (error) {}
}

function addFavorite(title, image, card) {
  const favoriteButton = card.querySelector(".favoretButton");
  favoriteButton.addEventListener("click", () => {
    let listfavorite = JSON.parse(localStorage.getItem("listOfFavorite")) || [];

    const alreadyExists = listfavorite.some(
      (element) => element.title === title
    );

    if (!alreadyExists) {
      listfavorite.push({
        image: image,
        title: title,
      });
    }

    // listfavorite.push({
    //   image: image,
    //   title: title,
    // });

    localStorage.setItem("listOfFavorite", JSON.stringify(listfavorite));
  });
}

function deleteFa(title, card, reload = false) {
  const deletetButton = card.querySelector(".deletetButton");

  deletetButton.addEventListener("click", () => {
    let listfavorite = JSON.parse(localStorage.getItem("listOfFavorite")) || [];

    listfavorite = listfavorite.filter((element) => element.title !== title);

    // if (!alreadyExists) {
    //   listfavorite.push({
    //     image: image,
    //     title: title,
    //   });
    // }

    // // listfavorite.push({
    // //   image: image,
    // //   title: title,
    // // });

    localStorage.setItem("listOfFavorite", JSON.stringify(listfavorite));
    if (reload) {
      location.reload();
    } else {
      card.remove();
    }
  });
}

const cardFavirot = document.getElementById("cardFavirot");

function cardFa() {
  try {
    const favorites = JSON.parse(localStorage.getItem("listOfFavorite")) || [];

    favorites.forEach((element) => {
      const card = document.createElement("div");
      card.className = "card1";

      card.innerHTML = `         <img class="imgcard" src="${
        element.image ? element.image : "images/not-found.png"
      }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${element.title}</p>
          
          

            
              </div>
   <button class="deletetButton">Delete FV</button> 
   
   </div>           

    `;

      // addFavorite(data.title, data.image, card);
      deleteFa(element.title, card, true);

      cardFavirot.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
}
cardFa();

async function viewDetails(id) {
  try {
    const CardContaier2 = document.getElementById("CardContaier2");

    const response = await fetch(`http://localhost:3001/recipes/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error:", errorData.error);
      document.getElementById("msseage2").innerText = errorData.error;
      return;
    }

    const data = await response.json();
    const card = document.createElement("div");
    card.className = "card";

    // const ingredientsHTML = data.extendedIngredients
    //   .map(
    //     (element, index) =>
    //       `<p class='houseOfCard'>${index + 1 + "." + element.name}</p>`
    //   )
    //   .join("");
    card.innerHTML = `         <img class="imgcard" src="${
      data.image ? data.image : "images/not-found.png"
    }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${data.title}</p>
<p>readyInMinutes: ${data.readyInMinutes}</p>
      Summary:        <p class="nameOfCard">${data.summary}</p>

    
          

            
              </div>
                     <div class="cardContant">       <button class="favoretButton">Favorite</button>
   <button class="deletetButton">Delete</button> 
   
   </div>           

    `;
    console.log("ffffffffffffffffffffffffffffff");

    addFavorite(data.title, data.image, card);
    deleteFa(data.title, card);
    CardContaier2.appendChild(card);
  } catch (error) {
    console.log(error);
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    viewDetails(id);
  }
});
