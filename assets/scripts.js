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

    figureAdd.appendChild(imageElement);
    figureAdd.appendChild(nomElement);
    gallery.appendChild(figureAdd);
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
  handleModal();
  createFigureModal();
})();

// Création Modale //
function openModal(e) {
  e.preventDefault();
  const target = document.getElementById("modal-main");
  if (target.classList.contains("modale-hidden")) {
    target.classList.remove("modale-hidden");
  }
}

// Fonction click "modifier" pour ouvrir modale et fermeture modale //
function handleModal() {
  const linkModalMain = document.getElementById("modal-main-link");
  linkModalMain.addEventListener("click", openModal);
  const closeElements = document.querySelectorAll(".js-modal-close");
  closeElements.forEach(function (value) {
    value.addEventListener("click", closeModal);
  });
  const closeModalMain = document.getElementById("modal-main");
  closeModalMain.addEventListener("click", function (e) {
    if (e.target === closeModalMain) {
      closeModal();
    }
  });
}

// Fonction fermeture modale //
function closeModal(e) {
  const modalMain = document.getElementById("modal-main");
  modalMain.classList.add("modale-hidden");
}

// Création images modale et logo supprimer //
async function createFigureModal() {
  let works = await getWorks();

  let gallery = document.querySelector(".modale-gallery");
  gallery.innerHTML = "";

  for (let work of works) {
    const figureAdd = document.createElement("figure");
    const imageElement = document.createElement("img");
    const nomElement = document.createElement("figcaption");

    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;
    figureAdd.id = work.id;

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-modal");

    const iconElement = document.createElement("i");
    iconElement.classList.add("fa-solid", "fa-trash-can");
    iconElement.addEventListener("click", removeWork);

    iconContainer.appendChild(iconElement);
    nomElement.appendChild(iconContainer);

    figureAdd.classList.add("relative-figure");

    figureAdd.appendChild(imageElement);
    figureAdd.appendChild(nomElement);
    gallery.appendChild(figureAdd);
  }
}

function removeWork(e) {
  const parent = e.target.closest("figure");
  console.log(parent);
  const parentID = parent.getAttribute("id");
  deleteWork(parentID);
}

async function deleteWork(id) {
  const reponse = await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  if (reponse.status == 204) {
    await createFigureModal();
    await createFigure();
  }
  const remove = await reponse.json();
  return remove;
}
