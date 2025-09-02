document.addEventListener("DOMContentLoaded", () => {
  const profileImg = document.querySelector(".w-24.h-24.rounded-full");
  const editProfileBtn = document.querySelector("button.bg-black"); // tombol Edit Profile
  const changeAddressBtn = document.querySelector("button.border"); // tombol Change my address
  const addressBox = document.querySelector("#address-box");

  // ✅ Edit Foto Profil
  if (editProfileBtn && profileImg) {
    editProfileBtn.addEventListener("click", () => {
      openEditModal("profile photo URL", "", (newUrl) => {
        if (newUrl) {
          profileImg.style.backgroundImage = `url(${newUrl})`;
          profileImg.classList.add("bg-cover", "bg-center");
          profileImg.classList.remove("bg-gray-300");
          showToast("Profile photo updated!");
        }
      });
    });
  }

  // ✅ Edit Alamat
  if (changeAddressBtn && addressBox) {
    changeAddressBtn.addEventListener("click", () => {
      const currentAddress = addressBox.innerText.trim();
      openEditModal("address", currentAddress, (newAddress) => {
        addressBox.innerText = newAddress;
        showToast("Address updated!");
      });
    });
  }

  // ✅ Edit Nama, TTL, dll
  const editableSelectors = {
    name: "#display-name",
    birth: "#display-birth",
    gender: "#display-gender",
    email: "#display-email",
    phone: "#display-phone"
  };

  Object.entries(editableSelectors).forEach(([key, selector]) => {
    const el = document.querySelector(selector);
    if (el) {
      el.addEventListener("click", () => {
        openEditModal(key, el.textContent.trim(), (newValue) => {
          el.textContent = newValue;
          showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} updated!`);
        });
      });
    }
  });

  // 🔧 Modal General
  function openEditModal(field, currentValue, onSave) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-lg font-semibold capitalize">Edit ${field}</h3>
        <input type="text" id="new-value" class="w-full border p-2 rounded" value="${currentValue}" placeholder="Enter new ${field}" />
        <div class="flex justify-end gap-2">
          <button id="cancel-btn" class="text-gray-500 hover:underline">Cancel</button>
          <button id="save-btn" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Save</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("save-btn").onclick = () => {
      const newVal = document.getElementById("new-value").value.trim();
      if (newVal) {
        onSave(newVal);
        modal.remove();
      }
    };
    document.getElementById("cancel-btn").onclick = () => modal.remove();
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  }

  // 🔔 Toast Message
  function showToast(msg) {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = "fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50 text-sm";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
});
