const CART_KEY = "bicistore_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const product = (window.products || []).find((p) => p.id === id);
  if (!product) {
    alert("Producto no encontrado.");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });
  }
  saveCart(cart);
  alert("Producto agregado al carrito.");
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalSpan = document.getElementById("cartTotal");
  if (!container || !totalSpan) return;

  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalSpan.textContent = "$0";
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <article class="cart-item">
          <img src="${item.image_url || "https://placehold.co/80x80?text=Bici"}" alt="${item.name}" />
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p>Cantidad: ${item.quantity}</p>
            <p>Precio unitario: $${Number(item.price).toLocaleString("es-CL")}</p>
          </div>
          <div class="cart-item-actions">
            <strong>$${subtotal.toLocaleString("es-CL")}</strong>
            <button class="btn-secondary" onclick="removeFromCart(${item.id})">Eliminar</button>
          </div>
        </article>
      `;
    })
    .join("");

  totalSpan.textContent = `$${total.toLocaleString("es-CL")}`;
}

async function sendOrder() {
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const cart = getCart();

  if (!cart.length) {
    alert("El carrito está vacío.");
    return;
  }
  if (!name || !email) {
    alert("Ingresa nombre y email.");
    return;
  }

  const payload = {
    customer_name: name,
    customer_email: email,
    items: cart,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al registrar pedido");
    const data = await res.json();
    alert("Pedido registrado con éxito. ID: " + data.id);
    saveCart([]);
    renderCart();
  } catch (err) {
    console.error(err);
    alert("No se pudo registrar el pedido.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cartItems")) {
    renderCart();
    const btn = document.getElementById("checkoutBtn");
    if (btn) btn.addEventListener("click", (e) => {
      e.preventDefault();
      sendOrder();
    });
  }
});
