async function handleAuth() {
  // Event bouton connecter //
  const formulaireLogin = document.getElementById("loginForm");
  formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Récupération informations login et mot de passe //
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Requête //
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Réponse //
    if (response.ok) {
      const data = await response.json();

      // Stockage token et redirection //
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "../index.html";
      }
    } else {
      const messageError = document.getElementById("error");
      messageError.classList.remove("hidden");
    }
  });
}
(function main() {
  handleAuth();
})();
