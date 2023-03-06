const inputAddress = document.getElementById("address");
const submitAddress = document.getElementById("submitAddress");
const addressError = document.getElementById("address-error");
const confirmOrder = document.getElementById("confirmOrder");


function getOrderItems() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/orderType");
  xhr.send();
  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
  });
}

function getUserAddress() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/userAddress");
  xhr.send();
  xhr.addEventListener("load", () => {
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
      inputAddress.value="";
    });
  } else {
    addressError.innerHTML = "Please Enter address in correct format";
  }
});

confirmOrder.addEventListener("click", () => {
  let orderList;
  let address;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/orderType");
  xhr.send();
  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log("orders", result.res);
    orderList = result.res;
    if (result.res) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/orders");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ order: orderList }));
      xhr.addEventListener("load", () => {
        let result = JSON.parse(xhr.response);
        console.log(result);
        if(result.res==="Success"){
          window.location.href="/myOrders";
        }
      });
    }
  });
});
