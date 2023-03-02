const submit = document.getElementById("submit");
const prodName = document.getElementById("productName");
const prodPrice = document.getElementById("price");
const prodDesc = document.getElementById("desc");
const prodStock = document.getElementById("stock");
const prodImage = document.getElementById("img");
const productError = document.getElementById("product-error");
const popUp = document.getElementById("pop-up");
const closePopup = document.getElementById("close-popup");
const parent = document.getElementById("cards-wrapper");
const addProducts = document.getElementById("addProducts");

displayProducts();

function displayProducts() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/addProduct");
  xhr.send();

  xhr.addEventListener("load", (req, res) => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    if (result.res === "No products") {
      console.log("You don't have any products");
      parent.innerHTML = "No products";
    } else {
      appendProducts(result.res);
    }
  });
}

function appendProducts(products) {
  products.forEach((product) => {
    appendOneProduct(product);
  });
}

function appendOneProduct(item) {
  let product = document.createElement("div");
  product.className = "cart";

  let productData = `<div class="cart-img cart-item">
  <img class="card-img-top" src=" ${item.productImage} " alt="...">
</div>
<div class="cart-body cart-item">
  <h2 class="card-title"> ${item.productName} </h2>
  <p class="card-text"><i class="fa-solid fa-indian-rupee-sign rupee"></i><span id="${item.productImage}p"> ${item.price}</span></p>
  <p class="card-text"><span id="${item.productImage}d"> ${item.productDesc} </span> </p>
  <p class="card-text"> Stock: <span id="${item.productImage}s"> ${item.stock} </span> </p>
</div>
<div class="cart-btn cart-item">
  <button class="btn btn-dark" id="${item.productImage}">Edit</button>
  <button onclick="updateItem(${item.productImage}u)"  class="btn btn-warning" id="${item.productImage}d">Disable</button>
</div>
</div>`;

  product.innerHTML = productData;
  parent.appendChild(product);
}

submit.addEventListener("click", () => {
  let productName = prodName.value.trim();
  let price = prodPrice.value.trim();
  let productDesc = prodDesc.value.trim();
  let productStock = prodStock.value.trim();

  if (productName && price && productDesc && productStock) {
    let form = new FormData();
    let productImage = prodImage.files[0];
    console.log(prodImage, productImage);
    form.append("productName", productName);
    form.append("price", price);
    form.append("productDesc", productDesc);
    form.append("productStock", productStock);
    form.append("productImage", productImage);

    insertProduct(form);
  } else {
    productError.innerHTML = "Please enter details in correct format!";
  }
});

addProducts.addEventListener("click", () => {
  popUp.classList.toggle("hidden");
});

function insertProduct(form) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/addProduct");
  //   xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(form);

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);

    if (result.res === "Success") {
      // window.location.href = "/addProduct";
      popUp.classList.toggle("hidden");
      let product = {
        productName: form.get("productName"),
        price: form.get("price"),
        productDesc: form.get("productDesc"),
        stock: form.get("productStock"),
        productImage: result.img,
      };
      appendOneProduct(product);
    } else {
      productError.innerHTML = "Can't upload product";
    }
  });
}

closePopup.addEventListener("click", function () {
  popUp.classList.toggle("hidden");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !popUp.classList.contains("hidden")) {
    popUp.classList.toggle("hidden");
  }
});
