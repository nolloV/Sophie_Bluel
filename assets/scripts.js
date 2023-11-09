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
  const closeModalAdd = document.getElementById("modal-add");
  closeModalAdd.addEventListener("click", function (e) {
    if (e.target === closeModalAdd) {
      closeModal();
    }
  });
}

// Fonction fermeture modale //
function closeModal(e) {
  const modalMain = document.getElementById("modal-main");
  const modalAdd = document.getElementById("modal-add");
  modalMain.classList.add("modale-hidden");
  modalAdd.classList.add("modale-hidden");
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
  const parentID = parent.getAttribute("id");
  deleteWork(parentID);
}

// Delete photo du serveur"
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
    return true;
  }
  return false;
}

// Bouton modale Ajouter //
function clickAdd() {
  const modalInputAdd = document.getElementById("modal-input-Add");
  const modalMain = document.getElementById("modal-main");
  const modalAdd = document.getElementById("modal-add");
  modalInputAdd.addEventListener("submit", (e) => {
    e.preventDefault();
    if (modalAdd.classList.contains("modale-hidden")) {
      modalAdd.classList.remove("modale-hidden");
      modalMain.classList.add("modale-hidden");
    }
  });
}

// Retour arrow //
function returnAdd() {
  const modalArrow = document.getElementById("arrow");
  const modalMain = document.getElementById("modal-main");
  const modalAdd = document.getElementById("modal-add");
  modalArrow.addEventListener("click", (e) => {
    e.preventDefault();
    if (modalMain.classList.contains("modale-hidden")) {
      modalAdd.classList.add("modale-hidden");
      modalMain.classList.remove("modale-hidden");
    }
  });
}

// Image preview //
function imagePreview() {
  const input = document.getElementById("myfile");
  const preview = document.querySelector(".preview");
  const parentDiv = document.querySelector(".element-to-hide");

  input.addEventListener("change", updateImageDisplay);

  function updateImageDisplay() {
    parentDiv.classList.add("hidden");
    const curFiles = input.files[0];
    const image = document.createElement("img");
    image.classList.add("preview-size");
    image.src = window.URL.createObjectURL(curFiles);
    preview.appendChild(image);
  }
}

// Création options //
async function createOptions() {
  const optionContainer = document.getElementById("Options");
  const categories = await getCategory();
  categories.unshift({ id: -1, name: "" });

  for (let category of categories) {
    const optionElement = document.createElement("option");
    optionElement.innerText = category.name;
    optionElement.value = category.id;
    optionContainer.appendChild(optionElement);
  }
}

// Vérification champs formulaire //
function validateForm() {
  const title = document.forms["fileinfo"]["title"].value;
  const category = document.forms["fileinfo"]["category"].value;
  const image = document.forms["fileinfo"]["image"].value;

  if (title === "") {
    alert("Le titre est manquant");
    return false;
  } else if (category === "-1") {
    alert("Veuillez sélectionner une catégorie");
    return false;
  } else if (image === "") {
    alert("L'image est manquante");
    return false;
  }
  return true;
}
function cleanForm() {
  document.fileinfo.reset();
  const imagePreview = document.querySelector(".preview");
  imagePreview.innerHTML = "";
  const hideElement = document.querySelector(".element-to-hide");
  hideElement.classList.remove("hidden");
}

// Création formulaire fetch FormData //
async function addPhoto() {
  const form = document.querySelector(".modal-add-form");
  const formData = new FormData(form);

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  if (response.status === 201) {
    console.log("Good");
    await createFigure();
    await createFigureModal();
    closeModal();
    cleanForm();
    alert("Bien ajouté !");
  } else {
    console.error("Not Good");
    validateForm();
  }
}

// Appel addPhoto lors du clique sur le bouton valider //
async function eventAdd() {
  const form = document.querySelector(".modal-add-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addPhoto();
  });
}

(function main() {
  createFigure();
  createCategory();
  hideElements();
  logout();
  handleModal();
  createFigureModal();
  clickAdd();
  returnAdd();
  createOptions();
  imagePreview();
  eventAdd();
})();
