document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    if (form.checkValidity()) {
      e.preventDefault();
      // Misalnya validasi berhasil (dummy login), arahkan ke homepage
      alert("Login succeeded!");
      window.location.href = "home.html";
    }
  });
});
