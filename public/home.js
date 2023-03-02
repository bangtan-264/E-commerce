const cardContainer = document.getElementById("card-container");
const loadMore = document.getElementById("loadMore");
const popUp = document.getElementById("pop-up");
const popImg = document.getElementById("pop-img");
const popTitle = document.getElementById("pop-title");
const popPrice = document.getElementById("pop-price");
const addToCart = document.getElementById("add-to-cart");
const goToCart = document.getElementById("go-to-cart");
const popDesc = document.getElementById("pop-desc");
const closePopup = document.getElementById("close-popup");
const buyNow = document.getElementById("buy-now");

let productCnt = 5;
let NoMoreProducts = false;

if (NoMoreProducts === false) {
  loadMore.addEventListener("click", () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/showProducts");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify({ index: productCnt }));

    xhr.addEventListener("load", () => {
      let productList = JSON.parse(xhr.response);
      let products = productList.products;
      if (products.length === 0) {
        loadMore.innerHTML = "No more Products";
        NoMoreProducts = true;
      }
      productCnt += 5;
      displayProducts(products, addProduct);
      console.log("More products loaded successfully");
    });
  });
}

function displayProducts(products, callback) {
  products.forEach((product) => {
    callback(product);
  });
}

function addProduct(product) {
  const card = document.createElement("div");
  card.classList.add("grid-item");

  let cardData = `<div class="product-card">
  <img class="card-img" src="${product.productImage}" alt="clothes" />
  <div class="card-content">
    <h1 class="card-head"> ${product.productName} </h1>
    <p class="card-txt">
    <i class="fa-solid fa-indian-rupee-sign rupee"></i>
      ${product.price}
    </p>
    <a onclick="viewDetails(${product.productId})" class="card-btn" id="${product.productId}">View Details</a>
  </div>
  </div>`;

  card.innerHTML = cardData;
  cardContainer.appendChild(card);
}

function viewDetails(productId) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/productInfo");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ id: productId }));

  xhr.addEventListener("load", () => {
    let products = JSON.parse(xhr.response);
    let productInfo = products.product;
    popUp.classList.toggle("hidden");
    popImg.src = productInfo[0].productImage;
    popTitle.innerHTML = productInfo[0].productName;
    popPrice.innerHTML = productInfo[0].price;
    popDesc.innerHTML = productInfo[0].productDesc;
    addToCart.key = productInfo[0].productId;
    buyNow.key = productInfo[0].productId;
  });
}

function addItemToCart() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/cart");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ productId: addToCart.key, quantity: 1 }));

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    if (result.res !== "Success") {
      console.log("Error in adding product to cart");
    } else {
      addToCart.classList.toggle("hidden");
      goToCart.classList.toggle("hidden");
    }
  });
}

function placeOrder() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/orderType");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ orderType: "product", productId: buyNow.key }));

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    window.location.href = "/orders";
  });
}

closePopup.addEventListener("click", function () {
  popUp.classList.toggle("hidden");
  if (addToCart.classList.contains("hidden")) {
    addToCart.classList.toggle("hidden");
    goToCart.classList.toggle("hidden");
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !popUp.classList.contains("hidden")) {
    popUp.classList.toggle("hidden");
    if (addToCart.classList.contains("hidden")) {
      addToCart.classList.toggle("hidden");
      goToCart.classList.toggle("hidden");
    }
  }
});
