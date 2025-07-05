const loginForm = document.getElementById("loginForm");
const usernameInput1 = document.getElementById("username");
const passwordInput1 = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
function login() {
  loginForm.addEventListener("submit", async function (e) {
    // Get form values
    e.preventDefault();
    const username = usernameInput1.value.trim();
    const password = passwordInput1.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 404) alert("user not found ");
        else if (response.status === 401) alert("Invalid Credential ");
        else alert("Some thing happend" + errorText);
        throw new Error(errorText);
      }
      const data = await response.json();

      if (!data) {
        alert("Your username and password are not correct ");
        return;
      }
      localStorage.setItem("token", data.token);
      console.log("Response:", response.data);

      window.location.href = "index.html";
    } catch (error) {
      console.error("Erorr login  ", error);
    }
  });
}
const handleSignUp = document.getElementById("handleSignUp");

function HandleSignUp() {
  handleSignUp.addEventListener("click", () => {
    window.location.href = "register.html";
  });
}
HandleSignUp();
login();
