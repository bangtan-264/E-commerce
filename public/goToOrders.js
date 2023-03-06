function openOrders() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/getOrder");
  xhr.send();

  xhr.addEventListener("load", () => {
    let result = JSON.parse(xhr.response);
    console.log(result);
    if (result.res === 1) {
      window.location.href = "/orders";
    } else {
      alert("Please login to continue");
    }
  });
}
