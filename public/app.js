// const { response } = require("express");
// require("./checkToken");
// const { parse } = require("dotenv");
// const { json } = require("express");

// const { json } = require("express");

// const axios = require("axios");
// const CardContaier = document.getElementById("CardContaier");
// // require("dotenv").config();

// const randomClick = document.getElementById("randomClick");
// document.getElementById("logoutButton").addEventListener("click", function () {
//   if (confirm("Are you sure you want to logout?")) {
//     localStorage.removeItem("token");

//     window.location.href = "login.html";
//   }
// });

// let listfavorite = [];
// randomClick.addEventListener("click", randomRecip);
async function randomRecip() {
  try {
    const response = await fetch(`/recipes/random`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      // console.log("Error:", errorData.error);
      document.getElementById("msseage1").innerText = errorData.error;
      return;
    }

    if (response.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
    const data = await response.json();
    const card = document.createElement("div");
    card.className = "card";

    const ingredientsHTML = data.extendedIngredients
      .map((element, index) => `  ${index + 1 + "." + element.name}  `)
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

    addFavorite(
      data.id,
      data.title,
      data.image,
      data.instructions,
      data.extendedIngredients,
      card
    );
    deleteFa(data.id, card);

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
  // console.log(ingredients);
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
    const response = await fetch(`/recipes/search?ingredients=${ingredients}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   msseage.innerText = errorData.error || "Something went wrong";

    //   if (response.status === 403) {
    //     localStorage.removeItem("token");
    //     window.location.href = "login.html";
    //   }

    //   return;
    // }

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
                  <p class="nameOfCard">missedIngredients : ${element.missedIngredients.join(
                    ","
                  )}</p>
       <p class="nameOfCard">usedIngredients:     ${element.usedIngredients.join(
         ","
       )}</p>
             <div class="cardContant">       <button class="favoretButton">Favorite</button>
             <button class="deletetButton">Delete FV</button>
                          <button class="addDetailes" id=${
                            element.id
                          }>Add Details</button>

             
 </div> 

    `;
      addFavorite(
        element.id,
        element.title,
        element.image,
        (instructions = "null"),
        (extendedIngredients = "null"),
        card
      );
      deleteFa(element.id, card);

      addCon.appendChild(card);

      const detail = card.querySelector(".addDetailes");
      // detail.addEventListener("click", () => {
      //   viewDetails(element.id);
      // });

      detail.addEventListener("click", () => {
        window.location.href = `Details.html?id=${element.id}`;
      });
    });
  } catch (error) {
    if (error.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  }
}

async function addFavorite(
  id,
  title,
  image,
  instructions,
  extendedIngredients,
  card
) {
  const favoriteButton = card.querySelector(".favoretButton");

  //////////////////////////////this code get and set data from local storeg////////////////////////////
  favoriteButton.addEventListener("click", async () => {
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

    ///////////////////////////////////////////////////////////////////////////////////

    ///////////////////////these code  is get and set data from data base  /////////////////////////////

    try {
      const response = await fetch(`/check/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        msseage.innerText = errorData.error;
        return;
      }
      const data = await response.json();
      // console.log(data);

      const alreadyExists = data.stu;
      // console.log("alreadyExists" + alreadyExists);
      // console.log(title);
      // console.log(title + "sssssssssssssss");

      if (!alreadyExists) {
        // console.log(title + "sssssssssssssss");

        const newRecipe = {
          id: id,
          title: title,
          image: image,
          instructions: instructions,
          ingredients: extendedIngredients,
          readyln: 5,
        };
        // console.log(newRecipe + "sssssssssssssss");

        try {
          const response = await fetch("/recipes/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newRecipe),
          });
          // console.log("Response:", response.data);
        } catch (error) {
          console.error("Error posting recipe:", error);
        }
      } else {
        alert("this item already exist");
      }
    } catch (error) {}

    // let listfavorite = JSON.parse(localStorage.getItem("listOfFavorite")) || [];

    //   const alreadyExists = listfavorite.some(
    //     (element) => element.title === title
    //   );

    //   if (!alreadyExists) {
    //     listfavorite.push({
    //       image: image,
    //       title: title,
    //     });
    //   }
  });
}

async function deleteFa(id, card, reload = false) {
  const deletetButton = card.querySelector(".deletetButton");

  deletetButton.addEventListener("click", async () => {
    // let listfavorite = JSON.parse(localStorage.getItem("listOfFavorite")) || [];

    // listfavorite = listfavorite.filter((element) => element.title !== title);
    // console.log("sssaaaaaaaaaaaaaaaaaa" + id + "Ssss");
    try {
      const response = fetch(`api/rexipes/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("delete item is done ");
      } else {
        const err = await response.json();
        console.error("Failed to delete item:", error);
        alert("Failed to delete: " + error.error);
      }
    } catch (error) {}
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

    // localStorage.setItem("listOfFavorite", JSON.stringify(listfavorite));
    if (reload) {
      location.reload();
    } else {
      card.remove();
    }
  });
}

const cardFavirot = document.getElementById("cardFavirot");

async function cardFa() {
  try {
    // const favorites = JSON.parse(localStorage.getItem("listOfFavorite")) || [];
    ////////////////////////////////////////

    const response = await fetch("/recipes/a/getAllfavorite");

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    ////////////////////////////
    data.forEach((element) => {
      const card = document.createElement("div");
      card.className = "card1";

      card.innerHTML = `         <img class="imgcard" src="${
        element.image ? element.image : "images/not-found.png"
      }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${element.title}</p>
          
          

            
              </div>
              <div  id="twobutton">
   <button class="deletetButton">Delete FV</button> 
      <button class="updatetButton">Update </button> </div>

   </div>           

    `;

      // console.log("pppppppp" + element.idre);
      // addFavorite(data.title, data.image, card);
      deleteFa(element.idre, card, true);

      const updateBtn = card.querySelector(".updatetButton");
      updateBtn.addEventListener("click", () => {
        window.location.href = `form.html?id=${element.idre}`;
      });

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

    const response = await fetch(`/recipes/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      // console.log("Error:", errorData.error);
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
    // console.log("ffffffffffffffffffffffffffffff");

    addFavorite(
      data.title,
      data.image,
      data.summary,
      (extendedIngredients = null),
      card
    );
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

async function editeDetails(
  id,
  image,
  instructions,
  ingredients,
  readyln,
  title
) {
  try {
    const CardContaier2 = document.getElementById("CardContaier2");

    const response = await fetch(`/recipes/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      // console.log("Error:", errorData.error);
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
      image ? image : "images/not-found.png"
    }" />  
              <div class="cardContant">
              
      <p class="nameOfCard">${title}</p>
<p>readyInMinutes: ${readyln}</p>
      Summary:        <p class="nameOfCard">${instructions}</p>

    
          

            
              </div>
                     <div class="cardContant">       <button class="favoretButton">Favorite</button>
   <button class="deletetButton">Delete</button> 
   
   </div>           

    `;
    // console.log("ffffffffffffffffffffffffffffff");

    addFavorite(
      data.title,
      data.image,
      data.summary,
      (extendedIngredients = null),
      card
    );
    deleteFa(data.title, card);
    CardContaier2.appendChild(card);
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  const randomClick = document.getElementById("randomClick");
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");

        window.location.href = "login.html";
      }
    });
}
logout();
