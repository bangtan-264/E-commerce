function openCart() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/getCart");
  xhr.send();

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    if (result.res === 1) {
      window.location.href = "/cart";
    } else {
      alert("Please login to continue");
    }
  });
}
