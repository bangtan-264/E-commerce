const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const input4Email = document.getElementById("inputEmail4");
const inputPassword4 = document.getElementById("inputPassword4");
const phoneNumber = document.getElementById("phoneNumber");
const signup = document.getElementById("signup");
const signupError = document.getElementById("signup-error");

signup.addEventListener("click", () => {
  let firstname = firstName.value.trim();
  let lastname = lastName.value.trim();
  let email = input4Email.value.trim();
  let password = inputPassword4.value.trim();
  let phonenumber = phoneNumber.value.trim();

  if (firstname && lastname && email && password) {
    let user = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
      phonenumber: phonenumber,
    };
    saveUserData(user);
  } else {
    signupError.innerHTML = "Please enter details in correct format!";
  }
});

function saveUserData(user) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/signup");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(user));

  xhr.addEventListener("load", () => {
    let res = xhr.response;
    console.log("Data stored in userDetails.json file");
    if (res == "Success") {
      window.location.href = "/";
    }
    if (res == "isUser") {
      signupError.innerHTML = "User Already exists!";
    }
  });
}
