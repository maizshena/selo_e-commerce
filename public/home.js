document.addEventListener("DOMContentLoaded", () => {
  const allProductsContainer = document.getElementById("meet-selo");
  const houseContainer = document.getElementById("selo-house");
  const beautyContainer = document.getElementById("selo-beauty");
  const groceriesContainer = document.getElementById("selo-groceries");

  fetch("https://dummyjson.com/products")
    .then((res) => res.json())
    .then((data) => {
      const allProducts = data.products;

      allProducts.slice(5, 17).forEach((product) => {
        const card = createProductCard(product);
        allProductsContainer.appendChild(card); 
      });

      // house section (kategori rumah)
      allProducts
        .filter(product => ["furniture"].includes(product.category))
        .forEach(product => {
          const card = createProductCard(product);
          houseContainer.appendChild(card);
        });

      allProducts
        .filter(product => ["beauty", "fragrances"].includes(product.category))
        .forEach(product => {
          const card = createProductCard(product);
          beautyContainer.appendChild(card);
        });

      // groceries section (kategori teknologi)
      allProducts
        .filter(product => ["groceries"].includes(product.category))
        .forEach(product => {
          const card = createProductCard(product);
          groceriesContainer.appendChild(card);
        });

    })
    .catch((err) => {
      console.error("Gagal memuat data produk:", err);
      meetSeloContainer.innerHTML = clothingContainer.innerHTML = techContainer.innerHTML =
        "<p class='text-red-500 text-center'>Gagal memuat produk.</p>";
    });
    const flashProductsContainer = document.getElementById("flash-products");
    allProducts.slice(0, 5).forEach(product => {
      const card = createProductCard(product);
      flashProductsContainer.appendChild(card);
    });

});

document.addEventListener("DOMContentLoaded", () => {
  
  const searchInput = document.getElementById("search-bar");
  const resultsContainer = document.getElementById("search-results");

  searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const value = searchInput.value.trim().toLowerCase();
    if (value) {
      window.location.href = `search.html?q=${encodeURIComponent(value)}`;
      }
      fetch("https://dummyjson.com/products")
        .then(res => res.json())
        .then(data => {
          const allProducts = data.products;

          const filtered = allProducts.filter(product => 
            product.title.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword)
          );

          resultsContainer.innerHTML = ""; // clear

          if (filtered.length === 0) {
            resultsContainer.innerHTML = `<p class="text-center col-span-full text-gray-400">No results found for "${keyword}".</p>`;
            return;
          }

          filtered.forEach(product => {
            const card = createProductCard(product); // pastikan fungsi ini udah ada
            resultsContainer.appendChild(card);
          });
        })
        .catch(err => {
          console.error("Search error:", err);
          resultsContainer.innerHTML = `<p class="text-center col-span-full text-red-500">Failed to search products.</p>`;
        });
        
    }
});
});

function fetchFlashSale() {
  const flashContainer = document.getElementById("flash-sale");
  if (!flashContainer) return console.warn("Flash sale container not found");

  fetch("https://dummyjson.com/products?limit=4&skip=5")
    .then(res => res.json())
    .then(data => {
      const products = data.products;

      flashContainer.innerHTML = ""; // kosongkan dulu

      products.forEach(product => {
        const card = createProductCard(product);
        flashContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load flash sale:", err);
      flashContainer.innerHTML = "<p class='col-span-full text-center text-red-500'>Flash sale gagal dimuat.</p>";
    });
}

function loadFlashSaleProducts() {
  fetch("https://dummyjson.com/products?limit=15")
    .then(res => res.json())
    .then(data => {
      const products = data.products;
      const track = document.getElementById("flash-track");
      track.innerHTML = "";

      for (let i = 0; i < products.length; i += 5) {
        const slide = document.createElement("div");
        slide.className = "flex shrink-0 w-full gap-4 px-2 justify-center";
        products.slice(i, i + 5).forEach(product => {
          const card = createFlashSaleCard(product); // pakai card baru
          slide.appendChild(card);
        });
        track.appendChild(slide);
      }

      setupFlashSlider();
    });
}

function createFlashSaleCard(product) {
  const card = document.createElement("div");
  // Menyesuaikan lebar card agar lebih proporsional dengan gambar
  card.className = "bg-white rounded-2xl shadow-md overflow-hidden flex flex-col w-40 sm:w-44 md:w-48 shrink-0 hover:shadow-lg transition snap-start";

  // Buat image container
  const imageContainer = document.createElement("div");
  // Menyesuaikan padding untuk gambar agar lebih mirip dengan contoh
  imageContainer.className = "w-full aspect-square bg-white p-4 flex justify-center items-center";
  imageContainer.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-contain mx-auto">
  `;

  // Buat info section (title & price & cart)
  const infoSection = document.createElement("div");
  // Mengurangi padding agar lebih compact dan menyesuaikan UI
  infoSection.className = "p-3 flex flex-col justify-between flex-1";

  const title = document.createElement("h3");
  title.textContent = product.title;
  // Mengurangi ukuran font judul dan memastikan truncate
  title.className = "text-sm font-semibold text-gray-800 truncate mb-2"; // Menambahkan margin-bottom

  const bottomRow = document.createElement("div");
  // Memastikan harga dan tombol keranjang berada di baris yang sama dan rata kanan-kiri
  bottomRow.className = "flex items-center justify-between mt-auto"; // mt-auto untuk push ke bawah

  const price = document.createElement("p");
  price.textContent = `$${product.price.toFixed(2)}`; // Menambahkan toFixed(2) untuk format harga
  // Menyesuaikan ukuran font harga
  price.className = "text-md font-bold text-black";

  const cartBtn = document.createElement("button");
  cartBtn.innerHTML = `

  `;
  cartBtn.onclick = (e) => {
    e.stopPropagation(); // mencegah redirect saat klik icon
    e.preventDefault();
    // Pastikan fungsi addToCart dan showToast didefinisikan di tempat lain
    // addToCart(product);
    // showToast("Item added to cart");
    console.log(`Produk "${product.title}" ditambahkan ke keranjang!`); // Contoh pengganti
  };

  bottomRow.appendChild(price);
  bottomRow.appendChild(cartBtn);

  infoSection.appendChild(title);
  infoSection.appendChild(bottomRow);

  // Bungkus semua dalam anchor supaya bisa diklik
  const wrapperLink = document.createElement("a");
  wrapperLink.href = `product.html?id=${product.id}`;
  wrapperLink.className = "block flex flex-col h-full"; // Menjadikan link sebagai flex container untuk mengisi tinggi penuh
  wrapperLink.appendChild(imageContainer);
  wrapperLink.appendChild(infoSection);

  card.appendChild(wrapperLink);
  return card;
}

const product = {
  id: productData.id,
  title: productData.title,
  image: productData.thumbnail,
  price: productData.price,
  brand: productData.brand,
  quantity: 1,
  selected: true,
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.push(product);
localStorage.setItem("cart", JSON.stringify(cart));

function addToCart(productData) {
  const product = {
    id: productData.id,
    title: productData.title,
    image: productData.thumbnail, // Atau productData.images[0] kalau pakai array
    price: productData.price,
    brand: productData.brand,
    quantity: 1,
    selected: true,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount(); // ⬅️ Tambahkan ini biar badge update!
  showToast("Added to cart!");

}

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="cursor-pointer bg-white p-4 rounded-lg shadow" onclick="goToProduct(${product.id})">
      <img src="${product.thumbnail}" class="w-full h-40 object-cover rounded mb-2" />
      <h3 class="text-lg font-semibold">${product.title}</h3>
      <p class="text-sm text-gray-500">${product.brand}</p>
      <p class="font-bold">$${product.price}</p>
    </div>
  `;
  document.getElementById("product-list").appendChild(card); // ganti sesuai ID container kamu
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = "fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow z-50 text-sm";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function setupFlashSlider() {
  const track = document.getElementById("flash-track");
  const slides = track.children;
  let currentIndex = 0;

  const nextBtn = document.getElementById("nextFlash");
  const prevBtn = document.getElementById("prevFlash");

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  nextBtn.onclick = () => goToSlide(currentIndex + 1);
  prevBtn.onclick = () => goToSlide(currentIndex - 1);

  // autoplay tiap 5 detik
  setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 5000);
}

function startFlashTimer(durationInSeconds = 10800) {
  const timerDisplay = document.getElementById("flash-timer");
  let remaining = durationInSeconds;

  const countdown = setInterval(() => {
    const hrs = String(Math.floor(remaining / 3600)).padStart(2, "0");
    const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
    const secs = String(remaining % 60).padStart(2, "0");

    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;

    if (remaining <= 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "00:00:00";
    } else {
      remaining--;
    }
  }, 1000);
}

// Call them when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadFlashSaleProducts();
  startFlashTimer();
});

  // Fungsi reusable untuk buat kartu produk
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "relative group block w-full bg-white hover:shadow-lg transition p-4 rounded-xl cursor-pointer";

  card.addEventListener("click", () => goToProduct(product.id));

  card.innerHTML = `
    <div class="aspect-square bg-gray-100 overflow-hidden mb-3">
      <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-cover">
    </div>
    <h3 class="text-sm font-semibold text-black" style="font-family: 'Inter', sans-serif;">${product.title}</h3>
    <p class="text-sm font-bold text-black mt-1" style="font-family: 'Inter', sans-serif;">$${product.price}</p>

    <button class="absolute bottom-4 right-4 bg-white border border-zinc-300 rounded-full p-2.5 px-3 opacity-0 group-hover:opacity-100 
      shadow-md transition duration-300 z-20 hover:bg-zinc-200 text-black"
      title="Add to cart">
      <i class="ph ph-shopping-cart text-lg"></i>
    </button>
  `;

  // Cegah redirect saat klik tombol cart
  const cartButton = card.querySelector("button");
  cartButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
    showToast("Added to cart!");
  });

  return card;
}

// Tambahkan listener ke semua kartu agar bisa diarahkan ke product.html
function goToProduct(productId) {
  localStorage.setItem("selectedProductId", productId);
  window.location.href = "product.html?id=" + productId;
}

// JavaScript for Slider
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");
  const slides = slider.querySelectorAll("img");
  const dotsContainer = document.getElementById("dots");

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Generate dots
  const dots = [];
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    dot.className = "w-2 h-2 rounded-full bg-white/50 hover:bg-white cursor-pointer transition";
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("bg-white", i === currentIndex);
      dot.classList.toggle("bg-white/50", i !== currentIndex);
    });
  }

  // Auto slide
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }, 4000);

  updateSlider(); // initial render
});

function showToast(message = "Added to cart!") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000); // Toast muncul 2 detik
}

document.addEventListener("DOMContentLoaded", () => {
  loadFlashSaleProducts();
});
