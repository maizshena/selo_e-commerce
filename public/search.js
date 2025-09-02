const resultsContainer = document.getElementById("search-results");
const searchInput = document.getElementById("search-bar");

document.addEventListener("DOMContentLoaded", () => {
  // Jalankan search pertama kali dari URL
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("q")?.toLowerCase();
  if (keyword) performSearch(keyword);

  // Event listener saat user tekan Enter
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = searchInput.value.trim().toLowerCase();
      if (value) {
        history.pushState({}, "", `?q=${encodeURIComponent(value)}`);
        performSearch(value);
      }
    }
  });

  updateCartCount();
});

function performSearch(keyword) {
  resultsContainer.innerHTML = '<p class="text-gray-500">Loading...</p>';

  fetch("https://dummyjson.com/products?limit=100")
    .then(res => res.json())
    .then(data => {
      const filtered = data.products.filter(product =>
        product.category.toLowerCase().includes(keyword) ||
        product.title.toLowerCase().includes(keyword)
      );

      resultsContainer.innerHTML = "";

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `<p class="text-gray-500 col-span-full">No results found for "${keyword}".</p>`;
        return;
      }

      filtered.forEach(product => {
        const card = createProductCard(product);
        resultsContainer.appendChild(card);
      });
    })
    .catch(() => {
      resultsContainer.innerHTML = "<p class='text-red-500'>Failed to load search results.</p>";
    });
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "relative group bg-white border rounded-xl p-3 hover:shadow-lg transition duration-300";

  card.innerHTML = `
    <a href="product.html?id=${product.id}" class="block">
      <div class="aspect-square bg-gray-100 overflow-hidden rounded-md mb-3 h-48">
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-cover" />
      </div>
      <h3 class="text-sm font-semibold text-black truncate">${product.title}</h3>
      <p class="text-sm font-bold text-black mt-1">$${product.price}</p>
    </a>

    <button class="absolute bottom-3 right-3 bg-white border border-gray-300 rounded-full p-3 opacity-0 group-hover:opacity-100 
      shadow-md transition duration-300 z-10 hover:bg-black hover:text-white text-lg"
      title="Add to cart">
      <i class="ph ph-shopping-cart"></i>
    </button>
  `;

  const cartBtn = card.querySelector("button");
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast("Added to cart!");
  });

  return card;
}

function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = totalQty;
    badge.classList.toggle("hidden", totalQty === 0);
  }
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-md z-50 animate-fade";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}
