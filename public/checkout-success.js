document.addEventListener("DOMContentLoaded", () => {
  // Ambil data dari localStorage
  const summary = JSON.parse(localStorage.getItem("checkoutSummary")) || {
    subtotal: 63,
    shipping: 0,
    tax: 10,
    total: 73
  };

  // Inject ke halaman
  document.getElementById("subtotal").textContent = `$${summary.subtotal}`;
  document.getElementById("shipping").textContent = summary.shipping === 0 ? "Free" : `$${summary.shipping}`;
  document.getElementById("tax").textContent = `$${summary.tax}`;
  document.getElementById("total").textContent = `$${summary.total}`;

  // Tampilkan notifikasi payment succeeded
  const toast = document.getElementById("payment-success-toast");
  toast.style.display = "flex";

  // Hilangkan notifikasi setelah 3 detik
  setTimeout(() => {
    toast.style.display = "none";
  }, 10000);

  // Countdown redirect
  let seconds = 5;
  const countdownEl = document.getElementById("countdown");
  const secondsEl = document.getElementById("seconds");

  const countdown = setInterval(() => {
    seconds--;
    secondsEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdown);
      window.location.href = "home.html"; // Pastikan path-nya benar
    }
  }, 1000);
});
