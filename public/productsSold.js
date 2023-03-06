const parent = document.getElementById("cards-wrapper");

dispalyItems();

function dispalyItems() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/getItemsSold");
  xhr.send();
  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    if (result.res.length !== 0) {
      appendItems(result.res);
      // displayTotalPrice(result.res);
    } else {
      parent.innerHTML = "No orders yet";
    }
  });
}

function appendItems(items) {
  console.log("Items", items);
  items.forEach((item) => {
    appendOneItem(item);
  });
}

function appendOneItem(item) {
  const cart = document.createElement("div");
  cart.className = "cart";

  const cartData = `<div class="cart-img cart-item">
  <img class="card-img-top" src=" ${item.productImage} " alt="...">
</div>
<div class="cart-body cart-item">
  <h2 class="card-title"> ${item.productName} </h2>
  <p class="card-text">Price: <i class="fa-solid fa-indian-rupee-sign rupee"></i><span> ${item.price}</span></p>
  <br>
  <span class="card-text"> Quantity: <span id="${item.productId}q"> ${item.quantity} </span> </span>
  </div>
</div>`;

  cart.innerHTML = cartData;
  parent.appendChild(cart);
}
