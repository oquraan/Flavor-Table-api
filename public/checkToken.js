function checkToken(responseStatus) {
  if (responseStatus === 403) {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}
