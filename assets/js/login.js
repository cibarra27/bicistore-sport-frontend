const TOKEN_KEY = "bicistore_token";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        alert("Usuario o contraseña incorrectos.");
        return;
      }
      const data = await res.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      window.location.href = "admin.html";
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión.");
    }
  });
});
