const inputAddress = document.getElementById("address");
const submitAddress = document.getElementById("submitAddress");
const addressError = document.getElementById("address-error");

getOrderItems();

function getOrderItems() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/orderType");
  xhr.send();
  xhr.addEventListener("click", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
  });
}

submitAddress.addEventListener("click", () => {
  let address = inputAddress.value.trim();
  if (address) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/userAddress");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ address: address }));

    xhr.addEventListener("load", () => {
      let result = JSON.parse(xhr.response);
      console.log(result);
    });
  } else {
    addressError.innerHTML = "Please Enter address in correct format";
  }
});
