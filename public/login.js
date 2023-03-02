const login = document.getElementById("login");
const loginEmail = document.getElementById("inputEmail");
const loginPassword = document.getElementById("inputPassword");
const loginError = document.getElementById("login-error");

login.addEventListener("click", () => {
  let email = loginEmail.value.trim();
  let password = loginPassword.value.trim();

  if (email && password) {
    let loginDetails = {
      email: email,
      password: password,
    };

    loginUser(loginDetails);
  } else {
    loginError.innerHTML = "Please enter details in correct format!";
  }
});

function loginUser(loginDetails) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/login");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(loginDetails));

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);

    if (result.res == "Success") {
      window.location.href = "/";
    } else {
      loginError.innerHTML = "User dosen't exist!";
    }
  });
}
