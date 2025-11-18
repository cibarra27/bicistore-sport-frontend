# BiciStore Sport - Frontend (HTML + CSS + JS)

- `index.html` → Landing principal.
- `catalogo.html` → Catálogo que consume la API `/api/products`.
- `carrito.html` → Carrito con `localStorage` + envío de pedido a `/api/orders`.
- `login.html` → Login admin contra `/api/auth/login`.
- `admin.html` → Panel CRUD de productos (requiere token).

Configura la URL de la API en `assets/js/config.js`:

```js
const API_BASE_URL = "http://localhost:4000/api";
// o la URL de Render cuando publiques
```

Para publicar este frontend en GitHub Pages:
1. Crea un repo, sube el contenido de `frontend/`.
2. Activa GitHub Pages desde Settings → Pages.
3. Usa la URL que te entregue GitHub como sitio público.
