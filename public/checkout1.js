document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedItems = cart.filter(item => item.selected);

  const itemsContainer = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("subtotal");
  const promoEl = document.getElementById("promo");
  const shippingEl = document.getElementById("shipping");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");
  const shippingText = document.getElementById("shipping-text");

  function format(num) {
    return `$${num.toFixed(2)}`;
  }

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = "fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50 text-sm";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  function calculateSummary() {
    let subtotal = 0;
    let shippingTotal = 0;
    let taxTotal = 0;
    let protectionTotal = 0;

    selectedItems.forEach(item => {
      const qty = item.quantity || 1;
      subtotal += item.price * qty;
      taxTotal += item.price * qty * 0.02;

      if (item.expedition === "sameday") shippingTotal += 5;
      if (item.protection) protectionTotal += 3;
    });

    const promoRate = 0.1;
    const promoAmount = subtotal * promoRate;
    const total = subtotal - promoAmount + shippingTotal + taxTotal + protectionTotal;

    subtotalEl.textContent = format(subtotal);
    promoEl.textContent = `- ${format(promoAmount)}`;
    shippingEl.textContent = format(shippingTotal + protectionTotal);
    taxEl.textContent = format(taxTotal);
    totalEl.textContent = format(total);
  }

  function renderItems() {
    itemsContainer.innerHTML = "";

    selectedItems.forEach((item, index) => {
      if (!item.expedition) item.expedition = "regular";
      if (typeof item.protection !== "boolean") item.protection = false;

      const div = document.createElement("div");
      div.className = "bg-white p-4 rounded-lg shadow-sm flex gap-4 items-start";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded" />
        <div class="flex-1">
          <h3 class="font-semibold text-base">${item.title}</h3>
          <p class="text-sm text-gray-500">${item.brand}</p>
          <p class="text-sm mt-1">Qty: ${item.quantity}</p>
          <p class="font-medium text-sm">Price: ${format(item.price * item.quantity)}</p>

          <div class="mt-3 space-y-2">
            <label class="block text-sm">Expedition:</label>
            <select data-index="${index}" class="expedition-select border rounded px-2 py-1">
              <option value="regular" ${item.expedition === "regular" ? "selected" : ""}>Regular Shipping (Free)</option>
              <option value="sameday" ${item.expedition === "sameday" ? "selected" : ""}>Sameday Shipping (+$5)</option>
            </select>

            <label class="inline-flex items-center mt-2 gap-2">
              <input type="checkbox" class="protection-checkbox" data-index="${index}" ${item.protection ? "checked" : ""} />
              <span class="text-sm">Extra safety for my package (+$3)</span>
            </label>
          </div>
        </div>
      `;
      itemsContainer.appendChild(div);
    });

    calculateSummary();
  }

  // Handle expedition & protection changes
  itemsContainer.addEventListener("change", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("expedition-select")) {
      selectedItems[index].expedition = e.target.value;
    } else if (e.target.classList.contains("protection-checkbox")) {
      selectedItems[index].protection = e.target.checked;
    }

    // Simpan update ke localStorage
    cart.forEach((item, idx) => {
      if (item.selected) {
        item.expedition = selectedItems[idx].expedition;
        item.protection = selectedItems[idx].protection;
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    calculateSummary();
  });

  // Ganti alamat pengiriman
  document.getElementById("change-address").addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h3 class="text-lg font-semibold">Change Shipping Address</h3>
        <textarea id="new-address" rows="3" class="w-full border p-2 rounded">${shippingText.innerText}</textarea>
        <div class="flex justify-between">
          <button id="use-location" class="text-blue-500 hover:underline">Use current location</button>
          <button id="save-address" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Save</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById("use-location").onclick = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = pos.coords;
          document.getElementById("new-address").value = `Lat: ${coords.latitude.toFixed(4)}, Long: ${coords.longitude.toFixed(4)}`;
        },
        () => alert("Failed to get location.")
      );
    };

    document.getElementById("save-address").onclick = () => {
      const newAddr = document.getElementById("new-address").value.trim();
      if (newAddr) {
        shippingText.innerHTML = `<p>${newAddr}</p><p class="text-gray-500">Updated</p>`;
        showToast("Address updated!");
        modal.remove();
      }
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  });

  renderItems();
});

placeOrderBtn.addEventListener("click", () => {
  placeOrderBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
  </svg>`;
  placeOrderBtn.disabled = true;

  const summaryData = {
    subtotal: parseFloat(subtotalEl.textContent.replace("$", "")),
    shipping: parseFloat(shippingEl.textContent.replace("$", "")) || 0,
    tax: parseFloat(taxEl.textContent.replace("$", "")) || 0,
    total: parseFloat(totalEl.textContent.replace("$", ""))
  };
  localStorage.setItem("checkoutSummary", JSON.stringify(summaryData));

  window.location.href = "checkout-success.html";
});

