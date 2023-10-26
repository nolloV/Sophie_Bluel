async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works/");
  const photos = await reponse.json();
  return photos;
}
async function getCategory() {
  const reponse = await fetch("http://localhost:5678/api/categories/");
  const category = await reponse.json();
  return category;
}

// Remplacement photos //
async function createFigure(id = -1) {
  let works = await getWorks();
  if (id != "-1") {
    works = works.filter((work) => work.category.id == id);
  }

  let gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let work of works) {
    const figureAdd = document.createElement("figure");
    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    nomElement.innerText = work.title;

    gallery.appendChild(figureAdd);
    figureAdd.appendChild(imageElement);
    figureAdd.appendChild(nomElement);
  }
}

// Création catégorie et tri //
async function createCategory() {
  const categoriesContainer = document.querySelector(".categories");
  const categories = await getCategory();
  categories.unshift({ id: -1, name: "Tous" });

  for (let category of categories) {
    const divElement = document.createElement("div");
    divElement.innerText = category.name;
    divElement.classList.add("category-item");
    divElement.id = category.id;
    categoriesContainer.appendChild(divElement);

    if (category.id === -1) {
      divElement.classList.add("selected");
    }

    divElement.addEventListener("click", async function (event) {
      const id = event.target.id;

      const selectedItem = document.querySelector(".selected");
      selectedItem.classList.remove("selected");
      event.target.classList.add("selected");

      createFigure(id);
    });
  }
}

function hideElements() {
  const adminElements = document.querySelectorAll(".admin-element");
  const adminElementsToHide = document.querySelectorAll(".to-hide");

  if (isConnected()) {
    adminElements.forEach((element) => {
      element.classList.remove("hidden");
    });

    adminElementsToHide.forEach((element) => {
      element.classList.add("hidden");
    });
  }
}
function logout() {
  const logoutReset = document.getElementById("logoutReset");
  logoutReset.addEventListener("click", function () {
    localStorage.removeItem("token");
  });
}

function isConnected() {
  return localStorage.getItem("token") != null;
}

(function main() {
  createFigure();
  createCategory();
  hideElements();
  logout();
})();
