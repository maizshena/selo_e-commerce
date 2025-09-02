document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");

  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const products = data.products;

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "bg-white shadow rounded-lg p-4";

        productCard.innerHTML = `
          <div class="w-full h-40 bg-gray-300 mb-4 overflow-hidden">
            <img src="${product.thumbnail}" alt="${product.title}" class="object-cover w-full h-full">
          </div>
          <h3 class="text-lg font-semibold text-gray-800">${product.title}</h3>
          <p class="text-sm text-gray-500">${product.description}</p>
          <p class="text-lg font-bold text-gray-800">$${product.price}</p>
        `;

        productList.appendChild(productCard);
      });
    })
    .catch((error) => {
      console.error("Gagal mengambil data produk:", error);
      productList.innerHTML =
        "<p class='text-red-500 col-span-full text-center'>Gagal memuat produk.</p>";
    });
});
