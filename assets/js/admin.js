const TOKEN_KEY = "bicistore_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function fetchAdminProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const products = await res.json();
    renderAdminTable(products);
  } catch (err) {
    console.error(err);
    document.querySelector("#productsTable tbody").innerHTML =
      "<tr><td colspan='6'>Error al cargar productos.</td></tr>";
  }
}

function renderAdminTable(products) {
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td>$${Number(p.price).toLocaleString("es-CL")}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn-secondary" onclick="editProduct(${p.id})">Editar</button>
          <button class="btn-secondary" onclick="deleteProduct(${p.id})">Eliminar</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const payload = {
    name: document.getElementById("name").value.trim(),
    brand: document.getElementById("brand").value.trim(),
    category: document.getElementById("category").value,
    price: Number(document.getElementById("price").value),
    stock: Number(document.getElementById("stock").value),
    image_url: document.getElementById("imageUrl").value.trim(),
    description: document.getElementById("description").value.trim(),
  };

  const method = id ? "PUT" : "POST";
  const url = id
    ? `${API_BASE_URL}/products/${id}`
    : `${API_BASE_URL}/products`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Error al guardar el producto.");
      return;
    }
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    fetchAdminProducts();
  } catch (err) {
    console.error(err);
    alert("Error al guardar el producto.");
  }
}

async function editProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) throw new Error();
    const p = await res.json();
    document.getElementById("productId").value = p.id;
    document.getElementById("name").value = p.name;
    document.getElementById("brand").value = p.brand;
    document.getElementById("category").value = p.category;
    document.getElementById("price").value = p.price;
    document.getElementById("stock").value = p.stock;
    document.getElementById("imageUrl").value = p.image_url || "";
    document.getElementById("description").value = p.description || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
    alert("Error al cargar el producto para edición.");
  }
}

async function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      alert("Error al eliminar el producto.");
      return;
    }
    fetchAdminProducts();
  } catch (err) {
    console.error(err);
    alert("Error al eliminar el producto.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  const form = document.getElementById("productForm");
  form.addEventListener("submit", saveProduct);
  document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    document.getElementById("productId").value = "";
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "login.html";
  });
  fetchAdminProducts();
});
