// === Global Cart State ===
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === DOM Ready ===
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const promoEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const promoWrapper = document.getElementById("promo-wrapper");
  const totalWrapper = document.getElementById("total-wrapper");
  const checkoutBtn = document.querySelector(".w-full.bg-black");

  const formatCurrency = (num) => `$${num.toFixed(2)}`;
  const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50 text-sm";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  function calculateSummary() {
    const selectedItems = cart.filter(item => item.selected);
    if (!selectedItems.length) {
      subtotalEl.textContent = "$0.00";
      promoEl.textContent = "-$0.00";
      totalEl.textContent = "$0.00";
      promoWrapper.style.display = "none";
      totalWrapper.style.display = "none";
      return;
    }

    promoWrapper.style.display = "flex";
    totalWrapper.style.display = "flex";

    const subtotal = selectedItems.reduce((sum, item) => {
      const qty = item.quantity > 0 ? item.quantity : 1;
      return sum + item.price * qty;
    }, 0);

    const promo = subtotal * 0.1;
    const total = subtotal - promo;

    subtotalEl.textContent = formatCurrency(subtotal);
    promoEl.textContent = `- ${formatCurrency(promo)}`;
    totalEl.textContent = formatCurrency(total);
  }

  function renderCart() {
    cartContainer.innerHTML = "";

    if (!cart.length) {
      cartContainer.innerHTML = `<div class="bg-white border p-4 text-center text-gray-500 rounded">You have to add items before check out products</div>`;
      calculateSummary();
      return;
    }

    cart.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "bg-white p-4 rounded-lg shadow-sm flex justify-between items-start gap-4 hover:bg-gray-50";
      itemEl.innerHTML = `
        <div class="flex items-start gap-4 flex-1">
          <input type="checkbox" data-index="${index}" ${item.selected ? "checked" : ""} class="select-item">
          <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded-md">
          <div>
            <h3 class="font-semibold">${item.title}</h3>
            <p class="text-sm text-gray-500">${item.brand}</p>
            <div class="flex items-center gap-2 mt-2">
              <button data-action="decrease" data-index="${index}" class="px-2 py-1 bg-gray-100 rounded">−</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-index="${index}" class="px-2 py-1 bg-gray-100 rounded">+</button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button data-action="wishlist" data-index="${index}" class="hover:bg-gray-200 px-3 py-1 rounded border">❤️ Wishlist</button>
          <button data-action="delete" data-index="${index}" class="hover:bg-gray-200 px-3 py-1 rounded border text-red-600">🗑️ Delete</button>
        </div>
      `;
      cartContainer.appendChild(itemEl);
    });

    calculateSummary();
  }

  cartContainer.addEventListener("click", (e) => {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (target.classList.contains("select-item")) {
      cart[index].selected = target.checked;
      saveCart();
      calculateSummary();
    }

    if (target.dataset.action === "increase") {
      cart[index].quantity += 1;
      saveCart();
      renderCart();
    }

    if (target.dataset.action === "decrease") {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart();
        renderCart();
      }
    }

    if (target.dataset.action === "delete") {
      cart.splice(index, 1);
      saveCart();
      renderCart();
      showToast("Item deleted.");
    }

    if (target.dataset.action === "wishlist") {
      showToast("Added to wishlist!");
    }
  });

  checkoutBtn.textContent = "Buy";
  checkoutBtn.addEventListener("click", () => {
    const selected = cart.filter(item => item.selected);
    if (!selected.length) {
      showToast("Your cart is empty!");
      return;
    }
    window.location.href = "checkout1.html";
  });

  renderCart();
});
