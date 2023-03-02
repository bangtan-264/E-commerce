const parent = document.getElementById("cards-wrapper");
const totalPrice = document.getElementById("totalPrice");
const itemsCount = document.getElementById("itemsCount");
const orderNow = document.getElementById("orderNow");

dispalyCartItems();

function dispalyCartItems() {
  let xhr = new XMLHttpRequest();
  xhr.open("get", "/getCartItems");
  xhr.send();
  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    if (result.res.length !== 0) {
      appendItems(result.res);
      displayTotalPrice(result.res);
    } else {
      parent.innerHTML = "Empty cart";
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
  <button onclick="incCartQuantity(${item.productId})" class="btn btn-dark" id="${item.productId}">+</button>
  <button onclick="decCartQuantity(${item.productId})" class="btn btn-dark" id=" ${item.cartId}">-</button>
</div>
<div class="cart-btn cart-item">
  <button onclick="removeFromCart(${item.cartId})" class="btn btn-dark" id="${item.cartId}">Delete</button>
  <button class="btn btn-warning" id="${item.cartId}">Buy Now</button>
</div>
</div>`;

  cart.innerHTML = cartData;
  parent.appendChild(cart);
}

function displayTotalPrice(items) {
  let price = 0;
  items.forEach((item) => {
    price += item.price * item.quantity;
  });
  if (price !== 0) {
    orderNow.classList.remove("hidden");
    totalPrice.innerHTML = price;
    itemsCount.innerHTML = items.length;
  } else {
    orderNow.classList.add("hidden");
  }
}

function changeTotalPrice(newPrice, change) {
  let price = parseInt(totalPrice.innerText);
  if (change === 1) {
    price += newPrice;
  } else {
    price -= newPrice;
  }
  if (price !== 0) {
    totalPrice.innerText = price;
  } else {
    orderNow.classList.add("hidden");
  }
}

function incCartQuantity(productId) {
  changeCartQuantity(productId, 1);
}

function decCartQuantity(productId) {
  changeCartQuantity(productId, -1);
}

function changeCartQuantity(productId, change) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/cartQuantity");
  xhr.setRequestHeader("Content-Type", "application/json");
  if (change == 1) {
    xhr.send(JSON.stringify({ productId: productId, quantity: 1 }));
  } else {
    xhr.send(JSON.stringify({ productId: productId, quantity: -1 }));
  }

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    if (result.res == "empty") {
      removeFromCart(result.cartId);
      changeTotalPrice(price, 0);
    } else if (result.res === "Out of stock") {
      alert("Product out of stock");
    } else {
      let quantity = result.quantity;
      let price = result.price;
      displayQuantity(quantity, productId);
      if (change == 1) {
        changeTotalPrice(price, 1);
      } else {
        changeTotalPrice(price, 0);
      }
    }
  });
}

function displayQuantity(quantity, productId) {
  console.log(productId);
  let quantityText = document.getElementById(`${productId}q`);
  quantityText.innerHTML = quantity;
}

function removeFromCart(cartId, newPrice) {
  console.log("cartId", cartId);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/removeFromCart");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ cartId }));

  xhr.addEventListener("load", function () {
    let result = JSON.parse(xhr.response);
    console.log(result);
    if (result.res === "Success") {
      // changeCheckout(price);
      window.location.href = "/cart";
    } else {
      console.log("Can't remove item");
    }
  });
}

function buyNow() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/orderType");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ orderType: "cartList" }));

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    window.location.href = "/orders";
  });
}
