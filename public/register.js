document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form"); // ambil elemen form

  form.addEventListener("submit", function (e) {
    // validasi browser otomatis jalan karena required dipakai
    // tapi kita bisa intercept kalau valid
    if (form.checkValidity()) {
      e.preventDefault(); // cegah submit default dulu
      // bisa tambahin logika simpan data, kirim ke backend, dll di sini
      alert("Sign up succeeded!");
      window.location.href = "home.html"; // redirect ke home
    }
    // else biarkan browser menampilkan warning dari required
  });
});
