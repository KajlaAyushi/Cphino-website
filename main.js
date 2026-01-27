document.addEventListener("DOMContentLoaded", () => {

  // Year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Feather icons
  if (window.feather) {
    feather.replace();
  }

  // Visitor Counter
  const counter = document.getElementById("visitorCount");
  if (!counter) return;

  fetch("https://api.countapi.xyz/create?namespace=cphino&key=visits&value=0")
    .then(() => fetch("https://api.countapi.xyz/hit/cphino/visits"))
    .then(res => res.json())
    .then(data => {
      counter.textContent = "Visitors: " + data.value;
    })
    .catch(() => {
      counter.textContent = "Visitors: unavailable";
    });

});
