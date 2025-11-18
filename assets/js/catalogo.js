let products = [];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error("Error al cargar productos");

    // Guardamos los productos en la variable local
    products = await res.json();

    // 🔥 Y aquí los exponemos al carrito
    window.products = products;

    renderProducts(products);
  } catch (err) {
    console.error(err);
    if (productsGrid) {
      productsGrid.innerHTML = "<p>Error al cargar el catálogo.</p>";
    }
  }
}

function renderProducts(list) {
  if (!productsGrid) return;

  if (!list.length) {
    productsGrid.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  productsGrid.innerHTML = list
    .map(
      (p) => `
      <article class="product-card">
        <img src="${p.image_url || "https://placehold.co/400x300?text=Bici"}" alt="${p.name}" />
        <div class="product-body">
          <h3>${p.name}</h3>
          <p>${p.brand}</p>
          <p class="price">$${Number(p.price).toLocaleString("es-CL")}</p>
        </div>
        <div class="product-footer">
          <button class="btn-primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
        </div>
      </article>
    `
    )
    .join("");
}

function applyFilters() {
  const term = (searchInput?.value || "").toLowerCase();
  const category = categoryFilter?.value || "";

  const filtered = products.filter((p) => {
    const matchesTerm =
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term);
    const matchesCategory = category ? p.category === category : true;
    return matchesTerm && matchesCategory;
  });

  renderProducts(filtered);
}

if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

window.addEventListener("DOMContentLoaded", fetchProducts);
