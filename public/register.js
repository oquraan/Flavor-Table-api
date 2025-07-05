const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const termsCheckbox = document.getElementById("terms");
const registerBtn = document.getElementById("registerBtn");
const successNotification = document.getElementById("successNotification");

const usernameError = document.getElementById("usernameError");
const usernameSuccess = document.getElementById("usernameSuccess");
const emailError = document.getElementById("emailError");
const emailSuccess = document.getElementById("emailSuccess");
const passwordError = document.getElementById("passwordError");
const passwordStrength = document.getElementById("passwordStrength");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
function SignUp() {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Some thing happend" + errorText);
        throw new Error(errorText);
      }
      const data = await response.json();

      window.location.href = "login.html";
    } catch (error) {
      console.error("Erorr login  ", error);
    }
  });
}
const handleSignIn = document.getElementById("handleSignIn");

function HandleSignIn() {
  handleSignIn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}
HandleSignIn();
SignUp();
