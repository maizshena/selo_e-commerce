document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    window.location.href = "product.html";
    return;
  }
  try {
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const product = await response.json();

    renderProduct(product);
    setupQuantityControls();
    setupCartButtons(product);
    setupWishlistButton(product);
    updateCartBadge();
  } catch (error) {
    console.error("Fetch failed:", error);
  }
});

function renderProduct(product) {
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-price").textContent = `$${product.price}`;
  document.getElementById("product-original").textContent = `$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}`;
  document.getElementById("product-image").src = product.thumbnail;
  document.getElementById("product-brand").textContent = product.brand;
  document.getElementById("product-rating").textContent = product.rating;
  document.getElementById("product-description").textContent = product.description;
}

function setupQuantityControls() {
  const qtyInput = document.getElementById("qty-value");
  document.getElementById("qty-minus").addEventListener("click", () => {
    const current = parseInt(qtyInput.value);
    if (current > 1) qtyInput.value = current - 1;
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    const current = parseInt(qtyInput.value);
    qtyInput.value = current + 1;
  });
}

function setupCartButtons(product) {
  const qtyInput = document.getElementById("qty-value");
  document.getElementById("add-to-cart").addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    updateCart(product, quantity);
    showFeedback("Added to cart!", "green");
  });

  document.getElementById("buy-now").addEventListener("click", () => {
    const quantity = parseInt(qtyInput.value);
    updateCart(product, quantity, true);
    window.location.href = "checkout1.html";
  });
}

function setupWishlistButton(product) {
  const wishlistBtn = document.getElementById("wishlist-btn");

  updateWishlistButtonState(wishlistBtn, product.id);

  wishlistBtn.addEventListener("click", () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index === -1) {
      wishlist.push({ id: product.id, title: product.title, thumbnail: product.thumbnail, price: product.price });
      showFeedback("Added to wishlist!", "pink");
    } else {
      wishlist.splice(index, 1);
      showFeedback("Removed from wishlist!", "gray");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistButtonState(wishlistBtn, product.id);
  });
}

function updateWishlistButtonState(button, productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const isInWishlist = wishlist.some(item => item.id === productId);
  button.innerHTML = isInWishlist
    ? '<i class="fas fa-heart text-red-500 text-lg"></i>'
    : '<i class="far fa-heart text-lg"></i>';
}

function updateCart(product, quantity, isBuyNow = false) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = {
    id: product.id,
    image: product.thumbnail,
    title: product.title,
    brand: product.brand,
    price: product.price,
    quantity: quantity,
    selected: true
  };

  if (isBuyNow) {
    cart = [item];
  } else {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push(item);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById("cart-count");
  if (cartBadge) cartBadge.textContent = totalItems;
}

function showFeedback(message, color) {
  const feedback = document.createElement("div");
  feedback.textContent = message;
  feedback.className = `fixed bottom-4 right-4 px-4 py-2 rounded bg-${color}-100 text-${color}-800 shadow z-50`;
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 2000);
}

function renderReviews(product) {
  const totalReviews = 330; // dummy
  const rating = product.rating;

  // Update total review teks
  document.getElementById("total-reviews").textContent = `${totalReviews} Reviews`;

  // Dummy distribusi rating (semua rata untuk contoh)
  const distribution = {
    5: 210,
    4: 60,
    3: 30,
    2: 20,
    1: 10
  };

  const ratingDistContainer = document.getElementById("rating-distribution");
  ratingDistContainer.innerHTML = "";
  Object.entries(distribution).forEach(([stars, count]) => {
    const bar = document.createElement("div");
    bar.className = "flex items-center space-x-2";
    bar.innerHTML = `
      <span class="w-5 text-sm">${stars}</span>
      <div class="flex-1 bg-gray-200 rounded h-3">
        <div class="bg-yellow-400 h-3 rounded" style="width:${(count / totalReviews) * 100}%"></div>
      </div>
      <span class="text-sm text-gray-500">${count}</span>
    `;
    ratingDistContainer.appendChild(bar);
  });

  // Dummy review user
  const reviewList = document.getElementById("review-list");
  const dummyReviews = Array.from({ length: 3 }, () => ({
    user: "Michael Angelo",
    content: "Good quality, love this very much!",
    rating: 5
  }));

  reviewList.innerHTML = "";
  dummyReviews.forEach((review) => {
    const item = document.createElement("div");
    item.className = "border-b pb-4 space-y-2";
    item.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-gray-300"></div>
        <div class="font-semibold">${review.user}</div>
      </div>
      <div class="text-yellow-400 text-sm">
        ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
      </div>
      <p>${review.content}</p>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>Did this reply help you?</span>
        <div class="flex space-x-2">
          <button class="flex items-center gap-1 px-2 py-1 border rounded-full"><i class="fas fa-thumbs-up"></i> Yes</button>
          <button class="flex items-center gap-1 px-2 py-1 border rounded-full"><i class="fas fa-thumbs-down"></i> No</button>
        </div>
      </div>
    `;
    reviewList.appendChild(item);
  });
  document.getElementById("product-description").textContent = product.description;

  renderReviews(product);
}

